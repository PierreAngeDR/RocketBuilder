<?php

namespace App\Service;


use Exception;
use Monolog\Logger;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;

class JsCleaner
{
    private static ?LoggerInterface $logger = null;

    public static function setLogger(?LoggerInterface $logger = null) {
        if (null === self::$logger) {
            self::$logger = $logger;
        }
    }

    public static function log(...$args) {
        self::$logger?->log(...$args);
    }

    public static function info(...$args) {
        self::$logger?->info(...$args);
    }

    /**
     * Remove ' tag="rocket" ' from script tags in Response content.
     *
     * @param Response $response
     * @param string|null $assetsBasePath
     * @return string
     */

    public static function cleanForServerHost(Response $response, ?string $assetsBasePath = ''): string
    {
        $content = $response->getContent();

        // Use regex to replace <script tag="rocket" and modify src=" for affected script tags
        $content = preg_replace_callback(
            '/<script\s+tag="rocket"\s+([^>]*?)src="([^"]*)"/',
            static function ($matches) use ($assetsBasePath) {
                // $matches[0] = full match
                // $matches[1] = attributes before src
                // $matches[2] = original src value

                // Replace `<script tag="rocket"` -> `<script` and modify the `src` attribute
                return '<script ' . $matches[1] . 'src="' . $assetsBasePath . $matches[2] . '"';
            },
            $content
        );

        return $content;
    }


    /**
     * @param Response $response
     * @return string
     */
    public static function cleanForLocalFile(Response $response, ?LoggerInterface $logger = null) : string
    {
        self::setLogger($logger);

        $content = $response->getContent();

        $replacement = '';
        // Find all included scripts that have a <script tag="rocket" src="some_js_script" type="module"></script> model
        $regex = '/<script\s+tag="rocket"\s+src="([^"]+)"\s+type="module"><\/script>/';
        preg_match_all($regex, $content, $matches);
        $newScripts = [];
        foreach($matches[0] as $index => $match) {
            $newScripts[] =  __DIR__.'/../../public'.$matches[1][$index];

            // Remove script from content
            $content = str_replace($match, '', $content);
        }

        self::analyseScriptsRequirements($newScripts);

//        dd($newScripts, $matches);

        foreach($newScripts as $script) {
            $replacement .= "\n\n\n".file_get_contents($script);
        }


        $replacement = str_replace(['export default'], '', $replacement);
        $replacement = str_replace(['export'], '', $replacement);
        $replacement = self::replaceImportsWithBraces($replacement, '');

        return str_replace('// js-include-here', $replacement, $content);
    }

    /**
     * Normalizes a file path by converting it to an absolute path and cleaning any redundant slashes.
     *
     * This method uses `realpath` to resolve the absolute path to a file or directory. If `realpath` fails,
     * it falls back to a simple string replacement to normalize slashes, ensuring the path adheres to a
     * consistent format.
     *
     * @param string $path The file or directory path to be normalized.
     *
     * @return string The normalized path.
     */
    private static function normalizePath(string $path): string {
            // Use realpath for accurate normalization, fallback to cleaning slashes when realpath fails
            return realpath($path) ?: str_replace(['\\', '//'], ['/', '/'], $path);
    }

    /**
     * Processes a JavaScript file, recursively resolving and adding its imports to a list.
     *
     * This method reads the content of a given JavaScript file, analyzes its import statements,
     * resolves their file paths relative to the current file, and ensures all imports are added
     * to the provided list. Each file is processed only once to prevent infinite loops due to
     * circular dependencies.
     *
     * @param string $currentJsFile The path to the JavaScript file being processed.
     * @param array  &$JsList A reference to the list of JavaScript files to be processed, in order.
     * @param array  &$processedFiles A reference to the list of files already processed to avoid duplication.
     *
     * @throws \RuntimeException If the provided file does not exist or if an import path cannot be resolved.
     */
    private static function processFile(string $currentJsFile, array &$JsList, array &$processedFiles): void
    {
        $currentJsFile = self::normalizePath($currentJsFile); // Normalize path of current file

        // Add normalized path to the JsList if not already present
        if (!in_array($currentJsFile, $JsList, true)) {
            $JsList[] = $currentJsFile;
        }

        // Avoid re-processing the same file
        if (in_array($currentJsFile, $processedFiles, true)) {
            return;
        }
        $processedFiles[] = $currentJsFile;

        // Read the content of the JS file
        if (!file_exists($currentJsFile)) {
            throw new \RuntimeException("File not found: $currentJsFile");
        }
        $content = file_get_contents($currentJsFile);

        // Regex to find active (non-commented) 'import ... from ...;' statements
        // TODO : there is a bug in the regex : if the import line doesn't end with a ';', it fails.
        preg_match_all(
            '/^(?!\s*\/\/)\s*import\s+[^;]+from\s+[\'"]([^\'"]+)[\'"];?/m',
            $content,
            $matches
        );

        // Add each imported file to the JsList, normalize it, and process recursively
        $imports = $matches[1]; // Extract relative paths from import statements
        foreach ($imports as $import) {
            self::info("Processing import: $import");
            // Resolve and normalize the relative path of the import
            $importedFilePath = self::normalizePath(dirname($currentJsFile) . DIRECTORY_SEPARATOR . $import);

            if (!$importedFilePath) {
                throw new \RuntimeException("Failed to resolve import path: $import in $currentJsFile");
            }

            // Insert the imported file into the list before the current file if not present
            $currentFileIndex = array_search($currentJsFile, $JsList, true);
            if ($currentFileIndex !== false) {
                if (($existingIndex = array_search($importedFilePath, $JsList, true)) !== false && $existingIndex > $currentFileIndex) {
                    // Remove and reinsert the imported file before the current one
                    array_splice($JsList, $existingIndex, 1);
                    array_splice($JsList, $currentFileIndex, 0, [$importedFilePath]);
                } elseif ($existingIndex === false) {
                    // Add the imported file before the current file
                    array_splice($JsList, $currentFileIndex, 0, [$importedFilePath]);
                }
            } elseif (!in_array($importedFilePath, $JsList, true)) {
                // Just add if the current file is not yet processed
                $JsList[] = $importedFilePath;
            }

            // Recursively process the imported file
            self::processFile($importedFilePath, $JsList, $processedFiles);
        }
    }

    /**
     * Analyzes and resolves the requirements for a list of JavaScript files.
     *
     * This method ensures all JavaScript files in the given list are processed, resolving their
     * import dependencies recursively and normalizing their paths. Each file is only processed once
     * to prevent redundancy or infinite loops due to circular dependencies.
     *
     * @param array &$JsList A reference to the list of JavaScript files to be analyzed and processed, in order.
     *
     * @throws \RuntimeException If a file in the list or a dependency cannot be found or resolved during processing.
     */
    private static function analyseScriptsRequirements(array &$JsList) : void {
        $processedFiles = [];

        // Normalize all entries in the initial JsList
        $JsList = array_map(self::normalizePath(...), $JsList);

        // Process each file in the JsList
        foreach ($JsList as $jsFile) {
            self::info("---------------------------------------------------------------");
            self::info("Processing File $jsFile");
            self::processFile($jsFile, $JsList, $processedFiles);
            self::info("Processed $jsFile");
            self::info("---------------------------------------------------------------");
        }
    }


    /**
     * Replaces `import` statements in the given content with a specified replacement string.
     *
     * This method uses a regular expression to identify and replace JavaScript `import` statements
     * in the provided content. The matches for the imported names (with or without braces) and
     * module paths are replaced with the specified replacement string.
     *
     * @param string $content The content containing JavaScript code with `import` statements.
     * @param string $replacement The string to replace the `import` statements with.
     *
     * @return string The content with `import` statements replaced by the given replacement string.
     */
    private static function replaceImportsWithBraces($content, $replacement) : string {
        // Regular expression to match `import` statements
        //$regex = '/import\s+((?:[^{};]+|\{[^}]*\}))\s+from\s+[\'"]([^\'"]+)[\'"];/';
        $regex = '/import\s+((?:[^{};]+|\{[^}]*\}))\s+from\s+[\'"]([^\'"]+)[\'"];?/';

        // Replace all matches with the given replacement string
        return preg_replace($regex, $replacement, $content);
    }
}
<?php

namespace App\Service;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\BaseWriter;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use PhpOffice\PhpSpreadsheet\Writer\Pdf\Dompdf;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Doc : https://thetribe.io/managing-spreadsheets-with-symfony/
 *      https://phpspreadsheet.readthedocs.io/en/latest/#installation
 *      https://github.com/dompdf/dompdf
 */
class ExportService
{
    public static ?LoggerInterface $logger = null;

    private static function getSpreadSheet(array $columns, array $data) : Spreadsheet {
        $spreadsheet = new Spreadsheet();
        // Get active sheet - it is also possible to retrieve a specific sheet
        $sheet = $spreadsheet->getActiveSheet();

        $columnLetter = 'A';

        foreach ($columns as $column) {
            $columnName = $column['title'];
            // Allow to access AA column if needed and more
            $sheet->setCellValue($columnLetter.'1', $columnName);
            $columnLetter++;
        }


        $i = 2; // Beginning row for active sheet
        $lastI = 1;
        foreach ($data as $columnValue) {
            $columnLetter = 'A';

            foreach ($columns as $column) {
                $columnField = $column['field'];
                $sheet->setCellValue($columnLetter.$i, $columnValue[$columnField]);
                $columnLetter++;
            }
            $i++;
            if ((null !== self::$logger) && intdiv($i, 10000) === $lastI) {
                self::$logger->info("Processed $i rows");
                $lastI++;
            }
        }

        self::$logger?->info("Created Spreadsheet");

        return $spreadsheet;
    }

    private static function getStreamedResponse(BaseWriter $writer, string $fileName, string $contentType) : Response {
        $response = new StreamedResponse();
        $response->headers->set('Content-Type', $contentType);
        $response->headers->set('Content-Disposition', 'attachment;filename="'.$fileName.'"');
        $response->setPrivate();
        $response->headers->addCacheControlDirective('no-cache', true);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        $response->setCallback(function() use ($writer) {
            ExportService::$logger?->info("Starting StreamedResponse");
            $writer->save('php://output');
            ExportService::$logger?->info("Ending StreamedResponse");
        });

        return $response;
    }

    private static function getFormatExport(string $writerClass, string $contentType, string $extension, array $columns, array $data) : Response {
        self::$logger?->info("Starting Export for '$writerClass', ($extension extension)");
        $spreadSheet = self::getSpreadSheet($columns, $data);
        self::$logger?->info("Got Spreadsheet");

        $writer = new $writerClass($spreadSheet);
        self::$logger?->info("Got Writer");
        return self::getStreamedResponse($writer, 'export.'.$extension, $contentType);
    }

    private static function getXlsxExport(array $columns, array $data) : Response {
        $contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        return self::getFormatExport(Xlsx::class, $contentType, 'xlsx', $columns, $data);
    }

    private static function getCsvExport(array $columns, array $data) : Response {
        $contentType = 'text/csv';
        return self::getFormatExport(Csv::class, $contentType, 'csv', $columns, $data);
    }

    private static function getPdfExport(array $columns, array $data) : Response {
        $className = Dompdf::class;
        IOFactory::registerWriter('Pdf', $className);
        $contentType = 'application/pdf';
        return self::getFormatExport($className, $contentType, 'pdf', $columns, $data);
    }

    public static function getExport(array $columns, array $data, string $format, ?LoggerInterface $logger = null) : Response {
        if (null !== $logger) {
            self::$logger = $logger;
        }

        return match ($format) {
            'xlsx' => self::getXlsxExport($columns, $data),
            'csv' => self::getCsvExport($columns, $data),
            default => self::getPdfExport($columns, $data),
        };
    }
}
<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Question\ChoiceQuestion;

#[AsCommand(
    name: 'update:route-prefix',
    description: 'Met à jour route_prefix dans services.yaml à partir de .env.dev ou .env.prod',
)]
class UpdateRoutePrefixCommand extends Command
{

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $helper = $this->getHelper('question');
        $question = new ChoiceQuestion('Quel environnement utiliser ?', ['dev', 'prod'], 0);
        $env = $helper->ask($input, $output, $question);

        $envPath = dirname(__DIR__, 2) . "/.env.$env";
        if (!file_exists($envPath)) {
            $io->error("Le fichier $envPath n'existe pas.");
            return Command::FAILURE;
        }

        $lines = file($envPath);
        $prefix = null;

        foreach ($lines as $line) {
            if (preg_match('/^ROUTE_PREFIX=(.*)/', $line, $matches)) {
                $prefix = trim($matches[1], " \t\n\r\0\x0B\"'"); // trim espaces + guillemets
                break;
            }
        }

        if ($prefix === null) {
            $io->note("La variable ROUTE_PREFIX n'est pas définie dans $envPath. Elle sera ignorée.");
            $prefix = '';
        }

        $io->note("ROUTE_PREFIX résolu : " . ($prefix ?: '[vide]'));

        $servicesPath = dirname(__DIR__, 2) . '/config/services.yaml';
        if (!file_exists($servicesPath)) {
            $io->error('Le fichier config/services.yaml est introuvable.');
            return Command::FAILURE;
        }

        copy($servicesPath, $servicesPath . '.bak');

        $content = file_get_contents($servicesPath);
        if (preg_match('/route_prefix: .*/', $content)) {
            $content = preg_replace('/route_prefix: .*/', "route_prefix: '$prefix'", $content);
        } else {
            $content = preg_replace('/parameters:\s*/', "parameters:\n    route_prefix: '$prefix'\n", $content);
        }

        file_put_contents($servicesPath, $content);

        $io->success("✅ route_prefix mis à jour avec '$prefix' dans services.yaml (backup créé : services.yaml.bak)");

        return Command::SUCCESS;
    }
}

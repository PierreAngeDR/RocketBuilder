<?php

// src/Command/TestEmailCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsCommand(
    name: 'app:test-email',
    description: 'Teste l’envoi d’un email via ton serveur SMTP.',
)]
class TestEmailCommand extends Command
{
    public function __construct(private MailerInterface $mailer)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = (new Email())
            ->from('rocket@delbary-rouille.net')
            ->sender('rocket@delbary-rouille.net') // <- clé ici
            ->to('jmd.range@gmail.com')
            ->subject('Test depuis Symfony NEW')
            ->text('Bonjour Marc, Ceci est un test d’envoi NEW par Contact sans Html ni lien.');

        try {
            $this->mailer->send($email);
        } catch (\Throwable $e) {
            dump($e->getMessage());
        }
        $output->writeln('✅ Email envoyé !');

        return Command::SUCCESS;
    }
}

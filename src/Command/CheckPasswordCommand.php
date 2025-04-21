<?php
namespace App\Command;

use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:check-password',
    description: 'Vérifie le mot de passe d\'un utilisateur.',
)]
class CheckPasswordCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $hasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $helper = $this->getHelper('question');

        $emailQuestion = new Question('Email de l\'utilisateur : ');
        $email = $helper->ask($input, $output, $emailQuestion);

        $passwordQuestion = new Question('Mot de passe : ');
        $passwordQuestion->setHidden(true);
        $passwordQuestion->setHiddenFallback(false);
        $password = $helper->ask($input, $output, $passwordQuestion);

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            $output->writeln('<error>Utilisateur introuvable.</error>');
            return Command::FAILURE;
        }

        if ($this->hasher->isPasswordValid($user, $password)) {
            $output->writeln('<info>✅ Mot de passe valide.</info>');
        } else {
            $output->writeln('<error>❌ Mot de passe invalide.</error>');
        }

        return Command::SUCCESS;
    }
}

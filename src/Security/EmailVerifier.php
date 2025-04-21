<?php
// src/Security/EmailVerifier.php
namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;
use Symfony\Component\Mailer\MailerInterface;

class EmailVerifier
{
    public function __construct(
        private readonly VerifyEmailHelperInterface $verifyEmailHelper,
        private readonly MailerInterface $mailer
    ) {}

    public function sendEmailConfirmation(string $verifyEmailRouteName, User $user): void
    {
        $signatureComponents = $this->verifyEmailHelper->generateSignature(
            $verifyEmailRouteName,
            $user->getId(),
            $user->getEmail(),
            ['id' => $user->getId()]
        );

        $email = (new TemplatedEmail())
            ->from(new Address('rocket@delbary-rouille.net', 'Rocket Application'))
            ->to($user->getEmail())
            ->subject('Confirmez votre inscription')
            ->htmlTemplate('emails/confirmation_email.html.twig')
            ->context([
                'signedUrl' => $signatureComponents->getSignedUrl(),
                'expiresAt' => $signatureComponents->getExpiresAt(),
                'username' => $user->getEmail(),
            ]);

        $this->mailer->send($email);
    }

    public function handleEmailConfirmation(Request $request, User $user): void
    {
        try {
            $this->verifyEmailHelper->validateEmailConfirmation(
                $request->getUri(),
                $user->getId(),
                $user->getEmail()
            );

            $user->setIsVerified(true);
        } catch (VerifyEmailExceptionInterface $e) {
            throw $e;
        }
    }
}

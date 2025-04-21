<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\AppAuthenticator;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

final class RegistrationController extends AbstractController
{
//    #[Route('/registration', name: 'app_registration')]
//    public function index(): Response
//    {
//        return $this->render('registration/index.html.twig', [
//            'controller_name' => 'RegistrationController',
//        ]);
//    }

    public function __construct(private readonly EmailVerifier $emailVerifier) {}


    #[Route('/register', name: 'app_register')]
    public function register(Request $request,
                             UserPasswordHasherInterface $passwordHasher,
                             EntityManagerInterface $entityManager,
                             UserAuthenticatorInterface $userAuthenticator,
                             AppAuthenticator $authenticator): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('plainPassword')->getData();
            $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);
            $entityManager->flush();

            //$this->addFlash('success', 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter.');
            $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user);

            $this->addFlash('success', 'Compte créé. Un email de confirmation t’a été envoyé.');
            //return $this->redirectToRoute('app_login');
            return $this->redirectToRoute('app_local_full');
            return $userAuthenticator->authenticateUser(
                $user,
                $authenticator,
                $request
            );
        }

        return $this->render('registration/index.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
    {
        $id = $request->get('id');

        if (!$id) {
            throw $this->createNotFoundException('Aucun ID utilisateur');
        }

        $user = $userRepository->find($id);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur introuvable');
        }

        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (VerifyEmailExceptionInterface $e) {
            $this->addFlash('error', 'Le lien de vérification est invalide ou expiré.');
            return $this->redirectToRoute('app_register');
        }

        $this->addFlash('success', 'Ton email a été vérifié avec succès !');
        return $this->redirectToRoute('app_local_full');
    }


}

<?php

// src/Controller/Api/UserController.php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(?UserInterface $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'Not logged in'], 401);
        }

        return new JsonResponse([
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
        ]);
    }
}
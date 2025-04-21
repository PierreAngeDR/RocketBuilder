<?php

declare(strict_types=1);

// src/Controller/LoginController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
    #[Route('/login', name: 'app_login', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('login/login.html.twig');
    }
}
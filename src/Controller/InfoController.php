<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class InfoController extends AbstractController
{
    #[Route('/info', name: 'app_info')]
    public function index(): Response
    {

        return new RedirectResponse('https://pierre-ange.delbary-rouille.net/rocket/doc/');
    }
}

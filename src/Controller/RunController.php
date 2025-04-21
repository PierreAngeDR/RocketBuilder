<?php

namespace App\Controller;

use App\Service\JsCleaner;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class RunController extends AbstractController
{
    public function __construct(private readonly LoggerInterface $logger, private readonly ParameterBagInterface $params) {

    }

    #[Route('/', name: 'app_local')]
    public function localFileIndex(): Response
    {
//        if (!$this->getUser()?->isVerified()) {
//            throw $this->createAccessDeniedException('Tu dois confirmer ton email pour accéder à cette page.');
//        }



        $response = $this->render('rocket/index.html.twig', [
            'controller_name' => 'RunController',
        ]);

        $content = JsCleaner::cleanForLocalFile($response, $this->logger);

//        $filename = __DIR__.'/../../public/html/index.html';
//        file_put_contents($filename, $content);

        return new Response($content);
    }

    #[Route('/in', name: 'app_local_full')]
    public function loggedLocalFileIndex(): Response
    {
        //if (!$this->getUser()?->isVerified()) {
//        $user = $this->getUser();
//        if (null === $user = $this->getUser()) {
//            throw $this->createAccessDeniedException('Tu dois confirmer ton email pour accéder à cette page.');
//        }



        $response = $this->render('rocket/index.html.twig', [
            'controller_name' => 'RunController',
            //'user' => $user,
            'is_logged' => true,
        ]);

        $content = JsCleaner::cleanForLocalFile($response, $this->logger);

//        $filename = __DIR__.'/../../public/html/index.html';
//        file_put_contents($filename, $content);

        return new Response($content);
    }

    #[Route('/main', name: 'app_main')]
    public function mainFilesIndex(): Response
    {
        $assetsBasePath = $this->params->get('assets_base_path');

        $response = $this->render('rocket/index.html.twig', [
            'controller_name' => 'RunController',
        ]);


        return new Response(JsCleaner::cleanForServerHost($response, $assetsBasePath));
    }

    /**
     * Available styles are : corporate , academic, startup, magazine
     *
     *
     * @param string|null $style
     * @return Response
     */
    #[Route('/test/{style}', name: 'app_test')]
    public function test(?string $style = 'corporate'): Response
    {
        $indexFileName = "test/index-$style.html.twig";

        return  $this->render($indexFileName, []);
    }
}

<?php

namespace App\Controller;

use App\Service\ExportService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ExportController extends AbstractController
{
    public function __construct(private readonly LoggerInterface $logger) {
        $this->logger->info('ExportController created');
    }
    #[Route('/export', name: 'app_export', methods: ['POST'])]
    public function exportXlsx(Request $request): Response
    {
        $payload = $request->getPayload()->all();
        $columns = $payload['columns'];
        $data = $payload['data'];
        $format = $payload['fileFormat'];

        dump("Received export request & content");

        return ExportService::getExport($columns, $data, $format, $this->logger);
    }
}

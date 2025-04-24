<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Routing\RequestContext;

class RequestListener
{
    public function __construct(private RequestContext $context) {}

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $this->context->setBaseUrl($_ENV['ROUTE_PREFIX']);

    }
}
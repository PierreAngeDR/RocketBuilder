<?php


namespace App\DataPersister;

use App\Entity\RocketSubModule;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Bundle\SecurityBundle\Security;



//class RocketSubModuleDataPersister extends RocketDataPersister
//{
//    public function setProcessParameters(): void
//    {
//        $this->resourceClass = RocketSubModule::class;
//        $this->methods = [
//            'getRocketModules' => 'RocketModule',
//            'getRocketMotionScripts' => 'RocketMotionScript',
//            ];
//    }
//}


class RocketSubModuleDataPersister implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $decorated,
        private readonly Security $security,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof RocketSubModule) {
            return $this->decorated->process($data, $operation, $uriVariables, $context);
        }

        if (null === $data->getOwner()) {
            $data->setOwner($this->security->getUser());
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}
<?php

// src/State/RocketSubModuleProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\RocketSubModule;
use App\Repository\RocketSubModuleRepository;
use Symfony\Bundle\SecurityBundle\Security;

class RocketSubModuleProvider implements ProviderInterface
{
    public function __construct(
        private RocketSubModuleRepository $repository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|null|array
    {
        $user = $this->security->getUser();

        if ($operation->getName() === 'api_rocket_sub_modules_get_collection') {
            return $this->repository->findBy(['owner' => $user]);
        }

        if (isset($uriVariables['id'])) {
            $subModule = $this->repository->find($uriVariables['id']);
            if ($subModule && $subModule->getOwner() === $user) {
                return $subModule;
            }
            return null;
        }

        return null;
    }
}
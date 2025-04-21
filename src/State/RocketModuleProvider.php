<?php

// src/State/RocketModuleProvider.php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\RocketModule;
use App\Repository\RocketModuleRepository;
use Symfony\Bundle\SecurityBundle\Security;

class RocketModuleProvider implements ProviderInterface
{
    public function __construct(
        private RocketModuleRepository $repository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|null|array
    {
        $user = $this->security->getUser();

        // Collection GET
        if ($operation->getName() === 'api_rocket_modules_get_collection') {
            return $this->repository->findBy(['owner' => $user]);
        }

        // Item GET
        if (isset($uriVariables['id'])) {
            $module = $this->repository->find($uriVariables['id']);
            if ($module && $module->getOwner() === $user) {
                return $module;
            }
            return null;
        }

        return null;
    }
}
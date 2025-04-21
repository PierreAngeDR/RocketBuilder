<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\SecurityBundle\Security;

abstract class RocketDataPersister  implements ProcessorInterface
{
    protected string $resourceClass;
    protected array $methods;

    public function __construct(
        private readonly ProcessorInterface $decorated,
        private readonly Security $security
    ) {
        $this->setProcessParameters();
    }

    /**
     * In this method, you have to define :
     *  - $this->resourceClass (example = RocketMotionScript::class;)
     *  - $this->method (example = ['getRocketSubModules' => 'RocketSubModule', ];)
     *
     * @return void
     */
    abstract public function setProcessParameters(): void;

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
//        if (!$data instanceof $this->resourceClass) {
//            return $this->decorated->process($data, $operation, $uriVariables, $context);
//        }
//
//        $user = $this->security->getUser();
//        if (!$data->getOwner()) {
//            $data->setOwner($user);
//        }
//
//        foreach($this->methods as $method => $problematicModuleName) {
//            foreach ($data->$method() as $sub) {
//                if ($sub->getId()) {
//                    if ($sub->getOwner() !== $user) {
//                        throw new \RuntimeException("Un $problematicModuleName lié ne vous appartient pas.");
//                    }
//                } else {
//                    $sub->setOwner($user);
//                }
//            }
//        }


        if (!$data instanceof $this->resourceClass) {
            return $this->decorated->process($data, $operation, $uriVariables, $context);
        }

        $user = $this->security->getUser();

        // Attribue le propriétaire uniquement si vide (évite d’écraser en PUT)
        if (method_exists($data, 'getOwner') && $data->getOwner() === null) {
            $data->setOwner($user);
        }

        // Gère les relations ManyToMany déclarées
        foreach ($this->methods as $getter => $relatedEntityName) {
//            $collection = $data->$getter();
//
//            // Reset complet de la relation si un setter est dispo
//            $setter = 'set' . ucfirst(substr($getter, 3));
//            if (method_exists($data, $setter)) {
//                $data->$setter(new ArrayCollection()); // vide la relation
//            }
//
//            foreach ($collection as $related) {
//                if (method_exists($data, $getter)) {
//                    $data->$getter()->add($related);
//                }
//
//                // Vérifie le owner des objets liés
//                if (method_exists($related, 'getOwner')) {
//                    if ($related->getId()) {
//                        if ($related->getOwner() !== $user) {
//                            throw new \RuntimeException("Un $relatedEntityName lié ne vous appartient pas.");
//                        }
//                    } else {
//                        $related->setOwner($user);
//                    }
//                }
//            }
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}
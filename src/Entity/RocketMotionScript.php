<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\RocketMotionScriptRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\Ignore;

#[ORM\Entity(repositoryClass: RocketMotionScriptRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(),
        new Get(security: "object.getOwner() == user"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "object.getOwner() == user"),
        new Delete(security: "object.getOwner() == user"),
    ],
    normalizationContext: ['groups' => ['rocket_motion_script:read']],
    denormalizationContext: ['groups' => ['rocket_motion_script:write']]
)]
class RocketMotionScript
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rocket_motion_script:read', 'rocket_motion_script:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'rocketMotionScripts')]
    #[Ignore]
    private ?User $owner = null;


    #[ORM\Column]
//    #[Groups(['rocket_submodule:read', 'rocket_submodule:write', 'rocket_module:write'])]
    #[Groups(['rocket_motion_script:read', 'rocket_motion_script:write'])]
    private array $data = [];

    /**
     * @var Collection<int, RocketSubModule>
     */
//    #[ORM\ManyToMany(targetEntity: RocketSubModule::class, mappedBy: 'rocketMotionScripts', cascade: ['persist'])]
    #[ORM\ManyToMany(targetEntity: RocketSubModule::class, mappedBy: 'rocketMotionScripts')]
    #[Groups(['rocket_motion_script:read'])]
    private Collection $rocketSubModules;

    public function __construct()
    {
        $this->rocketSubModules = new ArrayCollection();
    }

    public function __toString() : string{
        return "RocketMotionScript with id ".$this->id;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    /**
     * @return Collection<int, RocketSubModule>
     */
    public function getRocketSubModules(): Collection
    {
        return $this->rocketSubModules;
    }

    public function addRocketSubModule(RocketSubModule $rocketSubModule): static
    {
        if (!$this->rocketSubModules->contains($rocketSubModule)) {
            $this->rocketSubModules->add($rocketSubModule);
        }

        return $this;
    }

    public function removeRocketSubModule(RocketSubModule $rocketSubModule): static
    {
        $this->rocketSubModules->removeElement($rocketSubModule);

        return $this;
    }
}

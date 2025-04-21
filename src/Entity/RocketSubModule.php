<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\RocketSubModuleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\Ignore;

#[ORM\Entity(repositoryClass: RocketSubModuleRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    operations: [
        new GetCollection(),
        new Get(security: "object.getOwner() == user"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "object.getOwner() == user"),
        new Delete(security: "object.getOwner() == user"),
    ],
    normalizationContext: ['groups' => ['rocket_submodule:read']],
    denormalizationContext: ['groups' => ['rocket_submodule:write']]
)]
class RocketSubModule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rocket_submodule:read', 'rocket_submodule:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'rocketSubModules')]
    #[Ignore]
    private ?User $owner = null;

    #[ORM\Column]
    #[Groups(['rocket_submodule:read', 'rocket_submodule:write', 'rocket_module:write'])]
    private array $data = [];

    /**
     * @var Collection<int, RocketModule>
     */
    #[ORM\ManyToMany(targetEntity: RocketModule::class, inversedBy: 'rocketSubModules', cascade: ['persist'])]
//    #[Groups(['rocket_submodule:read', 'rocket_submodule:write', 'rocket_module:write'])]
    #[Groups(['rocket_submodule:read', 'rocket_submodule:write'])]
    #[ApiProperty(writableLink: true)]
    private Collection $rocketModules;

    /**
     * @var Collection<int, RocketMotionScript>
     */
    #[ORM\ManyToMany(targetEntity: RocketMotionScript::class, inversedBy: 'rocketSubModules', cascade: ['persist'])]
    #[Groups(['rocket_submodule:read', 'rocket_submodule:write'])]
    #[ApiProperty(writableLink: true)]
    private Collection $rocketMotionScripts;

    public function __construct()
    {
        $this->rocketModules = new ArrayCollection();
        $this->rocketMotionScripts = new ArrayCollection();
    }

    public function __toString() : string{
        return "RocketSubModule with id ".$this->id;
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
     * @return Collection<int, RocketModule>
     */
    public function getRocketModules(): Collection
    {
        return $this->rocketModules;
    }

    public function addRocketModule(RocketModule $module): static
    {
        if (!$this->rocketModules->contains($module)) {
            $this->rocketModules->add($module);
        }

        return $this;
    }

    public function removeRocketModule(RocketModule $module): static
    {
        $this->rocketModules->removeElement($module);

        return $this;
    }

    /**
     * @return Collection<int, RocketMotionScript>
     */
    public function getRocketMotionScripts(): Collection
    {
        return $this->rocketMotionScripts;
    }

    public function addRocketMotionScript(RocketMotionScript $rocketMotionScript): static
    {
        if (!$this->rocketMotionScripts->contains($rocketMotionScript)) {
            $this->rocketMotionScripts->add($rocketMotionScript);
            //$rocketMotionScript->addRocketSubModule($this);
        }

        return $this;
    }

    public function removeRocketMotionScript(RocketMotionScript $rocketMotionScript): static
    {
        if ($this->rocketMotionScripts->removeElement($rocketMotionScript)) {
            $rocketMotionScript->removeRocketSubModule($this);
        }

        return $this;
    }
    #[Groups(['rocket_submodule:write'])]
    public function setRocketMotionScripts(iterable $scripts): static
    {
        dd($scripts); // <---- test ici
        $this->rocketMotionScripts->clear();

        foreach ($scripts as $script) {
            $this->addRocketMotionScript($script);
        }

        return $this;
    }
}

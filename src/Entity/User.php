<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type:'string', length: 180, unique: true)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isVerified = false;

    /**
     * @var Collection<int, RocketModule>
     */
    #[ORM\OneToMany(targetEntity: RocketModule::class, mappedBy: 'owner')]
    private Collection $rocketModules;

    /**
     * @var Collection<int, RocketSubModule>
     */
    #[ORM\OneToMany(targetEntity: RocketSubModule::class, mappedBy: 'owner')]
    private Collection $rocketSubModules;

    /**
     * @var Collection<int, RocketMotionScript>
     */
    #[ORM\OneToMany(targetEntity: RocketMotionScript::class, mappedBy: 'owner')]
    private Collection $rocketMotionScripts;

    public function __construct()
    {
        $this->rocketModules = new ArrayCollection();
        $this->rocketSubModules = new ArrayCollection();
        $this->rocketMotionScripts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    /**
     * @return Collection<int, RocketModule>
     */
    public function getRocketModules(): Collection
    {
        return $this->rocketModules;
    }

    public function addRocketModule(RocketModule $rocketModule): static
    {
        if (!$this->rocketModules->contains($rocketModule)) {
            $this->rocketModules->add($rocketModule);
            $rocketModule->setOwner($this);
        }

        return $this;
    }

    public function removeRocketModule(RocketModule $rocketModule): static
    {
        if ($this->rocketModules->removeElement($rocketModule)) {
            // set the owning side to null (unless already changed)
            if ($rocketModule->getOwner() === $this) {
                $rocketModule->setOwner(null);
            }
        }

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
            $rocketSubModule->setOwner($this);
        }

        return $this;
    }

    public function removeRocketSubModule(RocketSubModule $rocketSubModule): static
    {
        if ($this->rocketSubModules->removeElement($rocketSubModule)) {
            // set the owning side to null (unless already changed)
            if ($rocketSubModule->getOwner() === $this) {
                $rocketSubModule->setOwner(null);
            }
        }

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
            $rocketMotionScript->setOwner($this);
        }

        return $this;
    }

    public function removeRocketMotionScript(RocketMotionScript $rocketMotionScript): static
    {
        if ($this->rocketMotionScripts->removeElement($rocketMotionScript)) {
            // set the owning side to null (unless already changed)
            if ($rocketMotionScript->getOwner() === $this) {
                $rocketMotionScript->setOwner(null);
            }
        }

        return $this;
    }
}

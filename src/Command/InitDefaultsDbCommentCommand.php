<?php

namespace App\Command;

use App\Entity\RocketModule;
use App\Entity\RocketMotionScript;
use App\Entity\RocketSubModule;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:init-defaults-db',
    description: 'Crée les RocketModule, RocketSubModule et RocketMotionScript publics',
)]
class InitDefaultsDbCommentCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Vérifie s’il existe déjà un module "Default"
        $existing = $this->em->getRepository(RocketModule::class)->findOneBy(['owner' => null, 'data' => ['type' => 'default']]);
        if ($existing) {
            $output->writeln('<info>Des valeurs par défaut existent déjà. Rien à faire.</info>');
            return Command::SUCCESS;
        }

        $motion = new RocketMotionScript();
        $motion->setData($this->getMotionScript()['data']);
        $this->em->persist($motion);


        foreach($this->getModules() as $moduleData) {
            $module = new RocketModule();
            $name = $moduleData['data']['name'];
            $module->setData($moduleData['data']);

            foreach($this->getSubModules() as $subModuleData) {
                if ($subModuleData['module'] === $name) {
                    $subModule = new RocketSubModule();
                    $subModule->setData($subModuleData['data']);
                    $subModule->addRocketMotionScript($motion);
                    $module->addRocketSubModule($subModule);
                    $this->em->persist($subModule);
                    $this->em->persist($module);
                }
            }
        }

        $this->em->flush();

        $output->writeln('<info>Valeurs par défaut créées avec succès ✅</info>');

        return Command::SUCCESS;
    }

    private function getModules(): array
    {
        return [
            ['data' => ['name'=>'Basic']],
            ['data' => ['name'=>'Falcon9']]
        ];
    }

    private function getSubModules(): array
    {
        return [
            [
                'module'=>'Basic',
                'data'=>[
                    'name'=> 'Single Stage Rocket',
                    'dimensions' => [
                        'altitude' => 0,                 // altitude du module quand la fusée est au sol
                        'height' => 5,               // hauteur du module
                        'diameter' => 0.7,             // diamètre du module
                        'position' => 'central'         // 5 choix possibles: central, left, right, front, rear
                    ],
                    'm0'=> 100,
                    'mc'=> 50,
                    'dm'=> 1,
                    'A'=> 1,
                    'F'=> 5000,
                    'Cd'=> 0.5,       // Drag coefficient at zero altitude of the Rocket. This depends on each Rocket
                    'motion'=> 'RocketMotionStageExtended'
                ]
            ],
            [
                'module'=>'Falcon9',
                'data' => [
                    'name' => 'Falcon 9 Stage 1',
                    'dimensions' => [
                        'altitude' => 0,                 // altitude du module quand la fusée est au sol
                        'height' => 42.6,               // hauteur du module
                        'diameter' => 3.66,             // diamètre du module
                        'position' => 'central'         // 5 choix possibles: central, left, right, front, rear
                    ],
                    'm0' => 25600,                   // Masse du module à vide
                    'mc' => 400000,                  // Masse de carburant embarquée dans le module
                    'dm' => 1739,                    // Consommation de carburant / s
                    'A' => 11,                       // Section frontale (en m²)
                    //'F': 845000 * 9,
                    'F' => "function(){return this.t()<230 ? 845000 * 9 : 0}",// Poussée totale du module
                    'Cd' => 0.5,       // Drag coefficient at zero altitude of the module
                    'motion' => 'RocketMotionStageExtended',
                    'enginePropellingStartTime' => 0,
                    'enginePropellingDuration' => 230,
                    'separationTime' => 'endOfPropulsion'
                ]
            ],
            [
                'module'=>'Falcon9',
                'data' => [
                    'name' => 'Falcon 9 Prop Left',
                    'dimensions' => [
                        'altitude' => 0,
                        'height' => 44.6,
                        'diameter' => 3.66,
                        'offset' => 3.66/2,
                        'position' => 'left'
                    ],
                    'm0' => 22500,
                    'mc' => 411000,
                    'dm' => 1739,
                    'A' => 11,
                    'F' => "function(){return this.t()<195 ? 11710000/2 : 0}",
                    'Cd' => 0.5,       // Drag coefficient at zero altitude of the module
                    'motion' => 'RocketMotionStageExtended',
                    'enginePropellingStartTime' =>0,
                    'enginePropellingDuration' =>162,
                    'separationTime' =>'endOfPropulsion'
                ]
            ],
            [
                'module'=>'Falcon9',
                'data' => [
                    'name' => 'Falcon 9 Prop Right',
                    'dimensions' => [
                        'altitude' => 0,
                        'height' => 44.6,
                        'diameter' => 3.66,
                        'offset' => 3.66/2,
                        'position' => 'right'
                    ],
                    'm0' => 22500,
                    'mc' => 411000,
                    'dm' => 1739,
                    'A' => 11,
                    'F' => "function(){return this.t()<195 ? 11710000/2 : 0}",
                    'Cd' => 0.5,       // Drag coefficient at zero altitude of the module
                    'motion' => 'RocketMotionStageExtended',
                    'enginePropellingStartTime' =>0,
                    'enginePropellingDuration' =>162,
                    'separationTime' =>'endOfPropulsion'
                ]
            ],
            [
                'module'=>'Falcon9',
                'data' => [
                    'name' => 'Falcon 9 Stage 2',
                    'dimensions' => [
                        'altitude' => 42.6,
                        'height' => 12.6,
                        'diameter' => 3.66,
                        'position' => 'central'
                    ],
                    'm0' => 4000,
                    'mc' => 107500,
                    'dm' => 1739,
                    'A' => 11,
                    'F' => "function(){return this.t()<230 ? 0 : 934000}",
                    'Cd' => 0.5,       // Drag coefficient at zero altitude of the module
                    'motion' => 'RocketMotionStageExtended',
                    'enginePropellingStartTime' =>230,
                ]
            ]
        ];
    }

    private function getMotionScript(): array
    {
        return [
                'data' => [
                    'name' => 'RocketMotionStageExtended',
                    'script' => '// RocketMotionStageExtended is an existing base Class. You can use it like this, but never change it.',
                    'internalId' => 'default_motion_script'
                ]
        ];
    }
}

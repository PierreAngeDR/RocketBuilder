<?php

namespace App\DataPersister;

use App\Entity\RocketModule;

class RocketModuleDataPersister extends RocketDataPersister
{
    public function setProcessParameters(): void
    {
        $this->resourceClass = RocketModule::class;
        $this->methods = ['getRocketSubModules' => 'RocketSubModule'];
    }
}
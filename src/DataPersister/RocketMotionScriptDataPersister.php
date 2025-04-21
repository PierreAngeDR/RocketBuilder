<?php

namespace App\DataPersister;

use App\Entity\RocketMotionScript;

class RocketMotionScriptDataPersister extends RocketDataPersister
{
    public function setProcessParameters(): void
    {
        $this->resourceClass = RocketMotionScript::class;
        $this->methods = ['getRocketSubModules' => 'RocketSubModule'];
    }
}
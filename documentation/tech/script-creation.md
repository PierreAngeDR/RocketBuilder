# Creation de Scripts de Trajectoire


## Contexte

Imaginons que vous souhaitiez créer une classe de trajectoire propre à votre fusée.

Pour cela, il va vous falloir implémenter une nouvelle "Motion Class" en JavaScript. Appelons-la par exemple **`"NewMotionClass"`**.

Votre **`"NewMotionClass"`** sera implémentée grâce à l'éditeur de script fourni en mode connecté.

Vous pourrez y ajouter toutes les variables nécessaires à votre calcul de trajectoire, et y définir vos propres méthodes de calcul.


## Principe 

Chaque nouvelle classe sera affectée à un Sous-Module (par exemple, un étage de la fusée).


### Comment fonctionnent les modules et sous-modules ?

Au départ, une fusée est composée d'un seul Module qui constitue la fusée entière. Le Module contient tous les Sous-Module (SubModules), par exemple :

* l'étage central, 
* l'étage supérieur, 
* et les boosters sur les côtés. 

Au fil du temps, chaque Sous-Module va avoir son mode de fonctionnement propre. Par exemple, l'étage principal et les Boosters vont s'allumer au décollage de la fusée, alors que l'étage supérieur ne s'allumera que plus tard. Au bout d'un certain temps, les Boosters vont se détacher de la partie centrale (étage 1 + étage 2). A cet instant, chaque Booster devient un Module **indépendant** qui va vivre sa vie, en fonction de ses paramètres. On se retrouve alors avec 3 Modules :

* la partie centrale (étage 1 + étage supérieur)
* booster droit
* booster gauche

Pour calculer la trajectoire de **chaque** module, notre programme prend pour **chaque** module, celui qui est le plus haut. Pour chaque module, il calcule la nouvelle trajectoire en fonction des sous-modules actifs du module, et prend le sous-module le plus élevé du module pour calculer la position finale **du module**.


### Affectation des classes de trajectoire

Il est tout à fait possible que chaque sous-module ait sa propre classe de trajectoire. Ainsi, on pourrait envisager que : 

* les boosters aient la même manière de fonctionner (ce qui est généralement le cas), donc la même classe de trajectoire
* le premier étage de la fusée ait sa propre manière de fonctionner 
* le dernier étage ait sa propre manière de fonctionner.

Cela reviendrait typiquement à créer 3 classes de trajectoire (voire 4 si on considère que les boosters vont réagir différemment lors de la séparation).

Pour tout ceci, il faut créer des classes de fonctionnement.


## La base

**`"NewMotionClass"`** doit explicitement hériter de la classe **`"RocketMotionStageExtended"`**.


### La classe de base héritée

Le fichier de script qui contient **`"NewMotionClass"`**  ne **doit pas** faire d'import. Ce doit donc être un fichier de classe **autonôme**

Exemple de base : 

```javascript 

export default class NewMotionClass extends RocketMotionStageExtended {

}

```

### Les méthodes et variables globales/locales

La classe **`"RocketMotionStageExtended"`** propose des méthodes publiques qui peuvent être modifiées/héritées par chaque classe qui l'étend. De même, elle propose des variables accessibles, et variables locales/globales qui peuvent être visibles d'un Sous-Module à l'autre.


#### Les variables communes

Les variables accessibles propres aux Sous-Modules sont les suivantes : 

* `t` (temps), qui peut être accédée globalement en appelant `this.t()`
* `dt` (pas de temps), qui peut être accédée globalement en appelant `this.getDt()`
* `v` (vitesse), qui peut être accédée globalement en appelant `this.v()`
* `h` (altitude), qui peut être accédée globalement en appelant `this.h()`
* `m` (masse totale), qui peut être accédée globalement en appelant `this.m()`
* `specifications` (spécifications du sous-module), qui peut être accédée globalement en appelant `this. specifications()`
* `running` (est-ce que le -sousmodule est encore actif. Si oui, il reste dans le module, sinon, il devient un nouveau module indépendant), qui peut être accédée globalement en appelant `this.running()`
* `enginePropellingStartTime` (temps à partir duquel le moteur s'allume), qui peut être accédée globalement en appelant `this.enginePropellingStartTime()`
* `enginePropellingDuration` (temps de fonctionnement du moteur), qui peut être accédée globalement en appelant `this.enginePropellingDuration()`



#### Les variables globales/locales

Les variables locales/globales sont des variables qui sont à la fois propres aux sous-modules, et globales aux sous-modules, dans le sens où elles permettent d'obtenir la valeur `locale` au sous-module, de la variable ; mais aussi de fixer sa valeur locale ; mais également et surtout, d'obtenir la valeur totale des variables de même nom pour touts les sous-modules du module. On peut ainsi faire des calculs pour le module en entier au sein d'un sous-module.

Les variables locales/globales propres aux Sous-Modules sont les suivantes : 

* `F` (force de pousée), qui peut être accédée globalement en appelant `this.m0()`
* `m0` (masse à vide), qui peut être accédée globalement en appelant `this.m0()`
* `mc` (masse de carburant), qui peut être accédée globalement en appelant `this.m()`
* `A` (section frontale), qui peut être accédée globalement en appelant `this.A()`
* `dm` (masse total de tous les sous-module du module), qui peut être accédée globalement en appelant `this.dm()`


#### Les méthodes publiques héritables

Les méthodes suivantes peuvent être modifiées :

* `sharedF`
* `sharedA`
* `sharedM0`
* `sharedMc`
* `sharedM`
* `sharedDm`
* `calculateDrag`
* `calculateAcceleration`
* `updateEuler` (méthode de calcul par Euler)
* `updateHeun` (méthode de calcul par Heun)
* `updateRK4` (méthode de calcul par Runge-Kutta 4)
* `updateVariants`
* `addInternalVariables` (permet l'ajout de nouvelles variables locales)
* `doLoadSharedVariables` (permet l'ajout de nouvelles variables globales)


### Déclaration d'une nouvelle variable locale/globale

Imaginons que vous souhaitez ajouter une nouvelle variable qui interviendra dans votre calcul de trajectoire. Par exmple **`l'angle théta`** de la fusée avec l'axe vertical. Cette variable n'existe pas initialement dans le programme, mais vous avez la possibilité de la créer et de l'exploiter.

Pour ce faire, il vous faudra :

* Ajouter la variable via la méthode `RocketMotionSharedVariable.add`
* Créer une fonction qui renvoie une valeur partagée.


#### Exemple de déclaration de la variable locale Theta

Surchargez la méthode d'initialisation des variables locales/globales `addInternalVariables ` :


```javascript 

    addInternalVariables() {
        super.addInternalVariables();
        
        this._internals
            .addVariable('theta',0)           // Angle Theta

        return this;
    }
    
```

Ainsi, dans votre classe, vous aurez maintenant accès à une nouvelle variable propre à votre sous-module, et pourrez y accéder via : 

```javascript 

    this.tetha()	    // getter
    this.tetha(30)   // setter -- met la variable à la valeur 30.
    
```
    


#### Exemple de déclaration de la variable locale/globale Theta


Pour initialiser une nouvelle variable globale, vous devez d'abord avoir défini une variable **locale** comme vu juste avant.

Surchargez la méthode d'initialisation des variables locales/globales `doLoadSharedVariables ` :


```javascript 

    doLoadSharedVariables() {
        super.doLoadSharedVariables();

        // Angle thêta
        RocketMotionSharedVariable.add(this, 'theta', this.localTheta, this.sharedTheta);

        return this;
    }
    

```

où :

* this.localTheta() sera la valeur locale (identique à this.theta(), mais this.theta `locale` a été remplacée par this.localTheta)
* this.theta() sera la valeur globale commune ou compilée à tous les sous-modules du module.

Il vous faut maintenant définir la méthode **`sharedTheta`** qui permet de définir la méthode globale de la variable :


```javascript 


    sharedTheta() {
        return this.all().reduce((acc, motion)=> {
            // "all" est la fonction qui renvoie la liste de tous les sous-modules du module
            // "motion" est la classe de trajectoire du sous-module renvoyé
            return acc + motion.localTheta();
        }, 0);
    }
    
```

Par exemple, `this.theta()` renverra la somme des angles theta de chaque sous-module. En l'espèce, calculer la somme des angles thêta n'a pas forcément de sens, mais c'était pour donner un exemple.

Votre classe **`NewMotionClass `** ressemblerait alors à ceci : 


```javascript 

    export default class NewMotionClass extends RocketMotionStageExtended {
	    addInternalVariables() {
	        super.addInternalVariables();
	        
	        this._internals
	            .addVariable('theta',0)           // Angle Theta
	
	        return this;
	    }
	
	    doLoadSharedVariables() {
	        super.doLoadSharedVariables();
	
	        // Angle thêta
	        RocketMotionSharedVariable.add(this, 'theta', this.localTheta, this.sharedTheta);
	
	        return this;
	    }
	
	    sharedTheta() {
	        return this.all().reduce((acc, motion)=> {
	            // "all" est la fonction qui renvoie la liste de tous les sous-modules du module
	            // "motion" est la classe de trajectoire du sous-module renvoyé
	            return acc + motion.localTheta();
	        }, 0);
	    }
	}
    
```

# Exemple concret d'une nouvelle classe avec mouvement 2D
    
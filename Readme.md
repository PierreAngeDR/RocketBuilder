# Initialisation

Editer le fichier .env.dev ou .env.prod et configurer la connection base de données

    DATABASE_URL="mysql://root:motdepasse@127.0.0.1:3306/rocket?serverVersion=8.0"

    composer install

    ./build-tailwind.sh

    bin/console cache:clear

Configurer éventuellement la clé ROUTE_PREFIX dans .env.prod ou .env.dev, et lancer la régénération de la clé pour services.yaml :

    php bin/console update:route-prefix 



# Régéneration des clés jwt

    php bin/console lexik:jwt:generate-keypair

# Régénération assetmapper

    php bin/console asset-map:compile

# Création de la base de données

    php bin/console doctrine:database:create

    php bin/console make:migration

    php bin/console doctrine:migrations:migrate


# Initialiser la base :

    php bin/console app:init-defaults-db 


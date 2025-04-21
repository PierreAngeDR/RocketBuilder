<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250409085949 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE rocket_module (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, data JSON NOT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_39BE36DE7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rocket_sub_module (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, data JSON NOT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_DC4325DC7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rocket_sub_module_rocket_module (rocket_sub_module_id INT NOT NULL, rocket_module_id INT NOT NULL, INDEX IDX_F48A2438E5F4C975 (rocket_sub_module_id), INDEX IDX_F48A24384493D2CD (rocket_module_id), PRIMARY KEY(rocket_sub_module_id, rocket_module_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE rocket_module ADD CONSTRAINT FK_39BE36DE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rocket_sub_module ADD CONSTRAINT FK_DC4325DC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rocket_sub_module_rocket_module ADD CONSTRAINT FK_F48A2438E5F4C975 FOREIGN KEY (rocket_sub_module_id) REFERENCES rocket_sub_module (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rocket_sub_module_rocket_module ADD CONSTRAINT FK_F48A24384493D2CD FOREIGN KEY (rocket_module_id) REFERENCES rocket_module (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rocket_module DROP FOREIGN KEY FK_39BE36DE7E3C61F9');
        $this->addSql('ALTER TABLE rocket_sub_module DROP FOREIGN KEY FK_DC4325DC7E3C61F9');
        $this->addSql('ALTER TABLE rocket_sub_module_rocket_module DROP FOREIGN KEY FK_F48A2438E5F4C975');
        $this->addSql('ALTER TABLE rocket_sub_module_rocket_module DROP FOREIGN KEY FK_F48A24384493D2CD');
        $this->addSql('DROP TABLE rocket_module');
        $this->addSql('DROP TABLE rocket_sub_module');
        $this->addSql('DROP TABLE rocket_sub_module_rocket_module');
    }
}

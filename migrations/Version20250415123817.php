<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250415123817 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE rocket_motion_script (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, script LONGTEXT DEFAULT NULL, INDEX IDX_193A78717E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rocket_motion_script_rocket_sub_module (rocket_motion_script_id INT NOT NULL, rocket_sub_module_id INT NOT NULL, INDEX IDX_83C347971298ED02 (rocket_motion_script_id), INDEX IDX_83C34797E5F4C975 (rocket_sub_module_id), PRIMARY KEY(rocket_motion_script_id, rocket_sub_module_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE rocket_motion_script ADD CONSTRAINT FK_193A78717E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rocket_motion_script_rocket_sub_module ADD CONSTRAINT FK_83C347971298ED02 FOREIGN KEY (rocket_motion_script_id) REFERENCES rocket_motion_script (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rocket_motion_script_rocket_sub_module ADD CONSTRAINT FK_83C34797E5F4C975 FOREIGN KEY (rocket_sub_module_id) REFERENCES rocket_sub_module (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rocket_motion_script DROP FOREIGN KEY FK_193A78717E3C61F9');
        $this->addSql('ALTER TABLE rocket_motion_script_rocket_sub_module DROP FOREIGN KEY FK_83C347971298ED02');
        $this->addSql('ALTER TABLE rocket_motion_script_rocket_sub_module DROP FOREIGN KEY FK_83C34797E5F4C975');
        $this->addSql('DROP TABLE rocket_motion_script');
        $this->addSql('DROP TABLE rocket_motion_script_rocket_sub_module');
    }
}

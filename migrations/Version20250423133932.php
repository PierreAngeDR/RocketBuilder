<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250423133932 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE rocket_module (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, data JSON NOT NULL COMMENT '(DC2Type:json)', INDEX IDX_39BE36DE7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rocket_motion_script (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, data JSON NOT NULL COMMENT '(DC2Type:json)', INDEX IDX_193A78717E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rocket_sub_module (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, data JSON NOT NULL COMMENT '(DC2Type:json)', INDEX IDX_DC4325DC7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rocket_sub_module_rocket_module (rocket_sub_module_id INT NOT NULL, rocket_module_id INT NOT NULL, INDEX IDX_F48A2438E5F4C975 (rocket_sub_module_id), INDEX IDX_F48A24384493D2CD (rocket_module_id), PRIMARY KEY(rocket_sub_module_id, rocket_module_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rocket_sub_module_rocket_motion_script (rocket_sub_module_id INT NOT NULL, rocket_motion_script_id INT NOT NULL, INDEX IDX_E7D26051E5F4C975 (rocket_sub_module_id), INDEX IDX_E7D260511298ED02 (rocket_motion_script_id), PRIMARY KEY(rocket_sub_module_id, rocket_motion_script_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, is_verified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_module ADD CONSTRAINT FK_39BE36DE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_motion_script ADD CONSTRAINT FK_193A78717E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module ADD CONSTRAINT FK_DC4325DC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_module ADD CONSTRAINT FK_F48A2438E5F4C975 FOREIGN KEY (rocket_sub_module_id) REFERENCES rocket_sub_module (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_module ADD CONSTRAINT FK_F48A24384493D2CD FOREIGN KEY (rocket_module_id) REFERENCES rocket_module (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_motion_script ADD CONSTRAINT FK_E7D26051E5F4C975 FOREIGN KEY (rocket_sub_module_id) REFERENCES rocket_sub_module (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_motion_script ADD CONSTRAINT FK_E7D260511298ED02 FOREIGN KEY (rocket_motion_script_id) REFERENCES rocket_motion_script (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_module DROP FOREIGN KEY FK_39BE36DE7E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_motion_script DROP FOREIGN KEY FK_193A78717E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module DROP FOREIGN KEY FK_DC4325DC7E3C61F9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_module DROP FOREIGN KEY FK_F48A2438E5F4C975
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_module DROP FOREIGN KEY FK_F48A24384493D2CD
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_motion_script DROP FOREIGN KEY FK_E7D26051E5F4C975
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rocket_sub_module_rocket_motion_script DROP FOREIGN KEY FK_E7D260511298ED02
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rocket_module
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rocket_motion_script
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rocket_sub_module
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rocket_sub_module_rocket_module
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rocket_sub_module_rocket_motion_script
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE messenger_messages
        SQL);
    }
}

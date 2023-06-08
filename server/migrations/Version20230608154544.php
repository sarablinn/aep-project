<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230608154544 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE "event_event_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "game_game_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE mode_mode_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE "event" (event_id INT NOT NULL, event_name VARCHAR(30) NOT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(event_id))');
        $this->addSql('CREATE TABLE "game" (game_id INT NOT NULL, timestamp TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, score INT NOT NULL, PRIMARY KEY(game_id))');
        $this->addSql('CREATE TABLE mode (mode_id INT NOT NULL, mode_name VARCHAR(20) NOT NULL, time_limit INT NOT NULL, PRIMARY KEY(mode_id))');
        $this->addSql('CREATE TABLE role (role_id INT NOT NULL, role_name VARCHAR(50) NOT NULL, PRIMARY KEY(role_id))');
        $this->addSql('CREATE TABLE "user" (user_id INT NOT NULL, role_id INT NOT NULL, email VARCHAR(255) NOT NULL, username VARCHAR(50) DEFAULT NULL, first_name VARCHAR(75) DEFAULT NULL, last_name VARCHAR(75) DEFAULT NULL, background_color VARCHAR(20) DEFAULT NULL, foreground_color VARCHAR(20) DEFAULT NULL, user_token VARCHAR(50) DEFAULT NULL, PRIMARY KEY(user_id))');
        $this->addSql('CREATE UNIQUE INDEX ux_user_email ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX ux_user_username ON "user" (username)');
        $this->addSql('CREATE UNIQUE INDEX ux_user_user_token ON "user" (user_token)');
//        $this->addSql('CREATE INDEX IDX_8D93D649D60322AC ON "user" (role_id)');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT fk_role_user FOREIGN KEY (role_id) REFERENCES role (role_id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE "event_event_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE "game_game_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE mode_mode_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_user_id_seq" CASCADE');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT fk_role_user');
        $this->addSql('DROP TABLE "event"');
        $this->addSql('DROP TABLE "game"');
        $this->addSql('DROP TABLE mode');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE "user"');
    }
}

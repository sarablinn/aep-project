<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230607201708 extends AbstractMigration
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
        $this->addSql('CREATE TABLE "event" (event_id INT NOT NULL, event_name VARCHAR(30) NOT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(event_id))');
        $this->addSql('CREATE TABLE "game" (game_id INT NOT NULL, timestamp TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, score INT NOT NULL, PRIMARY KEY(game_id))');
        $this->addSql('CREATE TABLE mode (mode_id INT NOT NULL, mode_name VARCHAR(20) NOT NULL, time_limit INT NOT NULL, PRIMARY KEY(mode_id))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE "event_event_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE "game_game_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE mode_mode_id_seq CASCADE');
        $this->addSql('DROP TABLE "event"');
        $this->addSql('DROP TABLE "game"');
        $this->addSql('DROP TABLE mode');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230608211456 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game_event (event_id INT NOT NULL, game_id INT NOT NULL, PRIMARY KEY(event_id, game_id))');
        $this->addSql('CREATE INDEX ix_event_game ON game_event (event_id)');
        $this->addSql('CREATE INDEX ix_game_event ON game_event (game_id)');
        $this->addSql('ALTER TABLE game_event ADD CONSTRAINT fk_event_game FOREIGN KEY (event_id) REFERENCES "event" (event_id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE game_event ADD CONSTRAINT fk_game_event FOREIGN KEY (game_id) REFERENCES "game" (game_id) NOT DEFERRABLE INITIALLY IMMEDIATE');

    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE game_event DROP CONSTRAINT fk_event_game');
        $this->addSql('ALTER TABLE game_event DROP CONSTRAINT fk_game_event');
        $this->addSql('DROP TABLE game_event');
    }
}

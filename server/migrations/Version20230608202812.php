<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230608202812 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event ADD created_by_user_id INT NOT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT fk_user_event FOREIGN KEY (created_by_user_id) REFERENCES "user" (user_id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX ix_user_event ON event (created_by_user_id)');
        $this->addSql('ALTER TABLE game ADD player_user_id INT NOT NULL');
        $this->addSql('ALTER TABLE game ADD mode_id INT NOT NULL');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT fk_user_game FOREIGN KEY (player_user_id) REFERENCES "user" (user_id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT fk_mode_game FOREIGN KEY (mode_id) REFERENCES mode (mode_id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX ix_user_game ON game (player_user_id)');
        $this->addSql('CREATE INDEX ix_mode_game ON game (mode_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "game" DROP CONSTRAINT fk_user_game');
        $this->addSql('ALTER TABLE "game" DROP CONSTRAINT fk_mode_game');
        $this->addSql('DROP INDEX ix_user_game');
        $this->addSql('DROP INDEX ix_mode_game');
        $this->addSql('ALTER TABLE "game" DROP player_user_id');
        $this->addSql('ALTER TABLE "game" DROP mode_id');
//        $this->addSql('ALTER INDEX idx_8d93d649d60322ac RENAME TO ix_role_user');
//        $this->addSql('ALTER INDEX uniq_8d93d649bdf55a63 RENAME TO ux_user_user_token');
//        $this->addSql('ALTER INDEX uniq_8d93d649f85e0677 RENAME TO ux_user_username');
//        $this->addSql('ALTER INDEX uniq_8d93d649e7927c74 RENAME TO ux_user_email');
        $this->addSql('ALTER TABLE "event" DROP CONSTRAINT fk_user_event');
        $this->addSql('DROP INDEX ix_user_event');
        $this->addSql('ALTER TABLE "event" DROP created_by_user_id');
    }
}

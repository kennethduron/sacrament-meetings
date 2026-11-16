-- Run this script in the Neon SQL Editor for the Sacrament Meetings project.
-- The table creation is repeat-safe. Seed rows are inserted only for dates that
-- do not already exist; existing meeting records are never replaced.

CREATE TABLE IF NOT EXISTS meetings (
  id             SERIAL        PRIMARY KEY,
  date           DATE          NOT NULL UNIQUE,
  meeting_type   VARCHAR(20)   NOT NULL CHECK (
    meeting_type IN ('testimony', 'regular', 'stake', 'general', 'special')
  ),
  presiding      VARCHAR(255)  NOT NULL,
  conducting     VARCHAR(255)  NOT NULL,
  announcements  TEXT[]        NOT NULL DEFAULT ARRAY[]::TEXT[],
  opening_hymn   JSONB         NOT NULL,
  opening_prayer VARCHAR(255)  NOT NULL DEFAULT '',
  ward_business  JSONB         NOT NULL DEFAULT '[]'::JSONB,
  stake_business BOOLEAN       NOT NULL DEFAULT FALSE,
  sacrament_hymn JSONB         NOT NULL,
  speakers       JSONB         NOT NULL DEFAULT '[]'::JSONB,
  closing_hymn   JSONB         NOT NULL,
  closing_prayer VARCHAR(255)  NOT NULL DEFAULT ''
);

INSERT INTO meetings (
  date, meeting_type, presiding, conducting, announcements,
  opening_hymn, opening_prayer, ward_business, stake_business,
  sacrament_hymn, speakers, closing_hymn, closing_prayer
) VALUES
  (
    '2026-11-08', 'regular', 'Jordan Sample', 'Morgan Example',
    ARRAY['Example notice: the service project sign-up closes next Sunday.', 'Example notice: the youth music rehearsal begins at 4:00 p.m.'],
    '{"number":1,"title":"A Sabbath Morning (sample hymn)"}'::JSONB, 'Taylor Fiction',
    '[{"description":"Example: sustain the proposed Primary activity leader."}]'::JSONB, FALSE,
    '{"number":2,"title":"Remembering the Savior (sample hymn)"}'::JSONB,
    '[{"name":"Casey Sample","topic":"Finding peace through daily discipleship","type":"speaker"},{"name":"Avery Fiction","topic":"Small acts of service","type":"speaker"}]'::JSONB,
    '{"number":3,"title":"Walk in the Light (sample hymn)"}'::JSONB, 'Riley Example'
  ),
  (
    '2026-11-01', 'testimony', 'Jordan Sample', 'Morgan Example',
    ARRAY['Example notice: November ministering interviews are available.'],
    '{"number":4,"title":"Come with a Willing Heart (sample hymn)"}'::JSONB, 'Taylor Fiction',
    '[]'::JSONB, FALSE,
    '{"number":5,"title":"In Remembrance (sample hymn)"}'::JSONB,
    '[{"name":"Sample Congregation","topic":"Personal testimonies","type":"speaker"}]'::JSONB,
    '{"number":6,"title":"A Quiet Prayer (sample hymn)"}'::JSONB, 'Avery Fiction'
  ),
  (
    '2026-10-25', 'stake', 'Not applicable to a ward sacrament program', 'Not applicable to a ward sacrament program',
    ARRAY[]::TEXT[], '{"number":0,"title":""}'::JSONB, '', '[]'::JSONB, TRUE,
    '{"number":0,"title":""}'::JSONB, '[]'::JSONB,
    '{"number":0,"title":""}'::JSONB, ''
  ),
  (
    '2026-10-18', 'general', 'Not applicable to a ward sacrament program', 'Not applicable to a ward sacrament program',
    ARRAY[]::TEXT[], '{"number":0,"title":""}'::JSONB, '', '[]'::JSONB, FALSE,
    '{"number":0,"title":""}'::JSONB, '[]'::JSONB,
    '{"number":0,"title":""}'::JSONB, ''
  ),
  (
    '2026-10-11', 'regular', 'Jordan Sample', 'Morgan Example',
    ARRAY[]::TEXT[], '{"number":7,"title":"A Place of Welcome (sample hymn)"}'::JSONB, 'Riley Example',
    '[]'::JSONB, TRUE,
    '{"number":8,"title":"The Shepherd''s Care (sample hymn)"}'::JSONB,
    '[{"name":"Casey Sample","topic":"Covenants and community","type":"speaker"},{"name":"Sample Ward Choir","topic":"A musical reflection (sample)","type":"musical-number"}]'::JSONB,
    '{"number":9,"title":"Hope for the Journey (sample hymn)"}'::JSONB, 'Taylor Fiction'
  ),
  (
    '2026-10-04', 'regular', 'Jordan Sample', 'Riley Example',
    ARRAY['Example notice: the ward choir welcomes new singers.'],
    '{"number":10,"title":"Come, Ye Children of the Lord (sample hymn)"}'::JSONB, 'Morgan Example',
    '[{"description":"Example: recognize the ward service project volunteers."}]'::JSONB, FALSE,
    '{"number":11,"title":"What Was Witnessed in the Heavens? (sample hymn)"}'::JSONB,
    '[{"name":"Avery Fiction","topic":"Serving one another","type":"speaker"}]'::JSONB,
    '{"number":12,"title":"Tis Sweet to Sing the Matchless Love (sample hymn)"}'::JSONB, 'Casey Sample'
  ),
  (
    '2026-09-27', 'testimony', 'Jordan Sample', 'Morgan Example',
    ARRAY[]::TEXT[], '{"number":13,"title":"An Angel from on High (sample hymn)"}'::JSONB, 'Taylor Fiction',
    '[]'::JSONB, FALSE,
    '{"number":14,"title":"I Stand All Amazed (sample hymn)"}'::JSONB,
    '[{"name":"Riley Example","topic":"Gratitude","type":"speaker"}]'::JSONB,
    '{"number":15,"title":"We Thank Thee, O God, for a Prophet (sample hymn)"}'::JSONB, 'Avery Fiction'
  ),
  (
    '2026-09-20', 'special', 'Jordan Sample', 'Morgan Example',
    ARRAY['Example notice: this is a fictional special Sunday program.'],
    '{"number":16,"title":"Come, Follow Me (sample hymn)"}'::JSONB, 'Casey Sample',
    '[]'::JSONB, FALSE,
    '{"number":17,"title":"While of These Emblems We Partake (sample hymn)"}'::JSONB,
    '[{"name":"Sample Youth Choir","topic":"A musical reflection (sample)","type":"musical-number"}]'::JSONB,
    '{"number":18,"title":"There Is a Green Hill Far Away (sample hymn)"}'::JSONB, 'Taylor Fiction'
  ),
  (
    '2026-11-15', 'regular', 'Jordan Sample', 'Morgan Example',
    ARRAY['Example notice: all names and announcements are fictional.'],
    '{"number":19,"title":"We Meet Again in Sabbath School (sample hymn)"}'::JSONB, 'Riley Example',
    '[]'::JSONB, FALSE,
    '{"number":20,"title":"O Thou, Before the World Began (sample hymn)"}'::JSONB,
    '[{"name":"Avery Fiction","topic":"Hope in Jesus Christ","type":"speaker"},{"name":"Casey Sample","topic":"Caring for our neighbors","type":"speaker"}]'::JSONB,
    '{"number":21,"title":"Come, Let Us Anew (sample hymn)"}'::JSONB, 'Morgan Example'
  )
ON CONFLICT (date) DO NOTHING;

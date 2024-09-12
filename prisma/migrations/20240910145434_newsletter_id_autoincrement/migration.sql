-- AlterTable
CREATE SEQUENCE newsletter_id_seq;
ALTER TABLE "Newsletter" ALTER COLUMN "id" SET DEFAULT nextval('newsletter_id_seq');
ALTER SEQUENCE newsletter_id_seq OWNED BY "Newsletter"."id";

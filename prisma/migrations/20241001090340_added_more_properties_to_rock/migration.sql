/*
  Warnings:

  - Added the required column `access` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banned` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `child_frienly` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `header_image` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nature` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nr` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `online` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orientation` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path_coordinates` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preview_image` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rain` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `season` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunny` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topo` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `train` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zone` to the `Rock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zoom` to the `Rock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Rock` ADD COLUMN `access` TEXT NOT NULL,
    ADD COLUMN `banned` SMALLINT NOT NULL,
    ADD COLUMN `child_frienly` SMALLINT NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `header_image` VARCHAR(255) NOT NULL,
    ADD COLUMN `height` SMALLINT NOT NULL,
    ADD COLUMN `image` VARCHAR(255) NOT NULL,
    ADD COLUMN `lat` DECIMAL(10, 6) NOT NULL,
    ADD COLUMN `lng` DECIMAL(10, 6) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `nature` TEXT NOT NULL,
    ADD COLUMN `nr` SMALLINT NOT NULL,
    ADD COLUMN `online` SMALLINT NOT NULL,
    ADD COLUMN `orientation` VARCHAR(50) NOT NULL,
    ADD COLUMN `path_coordinates` JSON NOT NULL,
    ADD COLUMN `preview_image` VARCHAR(255) NOT NULL,
    ADD COLUMN `rain` SMALLINT NOT NULL,
    ADD COLUMN `season` VARCHAR(50) NOT NULL,
    ADD COLUMN `slug` VARCHAR(255) NOT NULL,
    ADD COLUMN `sunny` SMALLINT NOT NULL,
    ADD COLUMN `topo` SMALLINT NOT NULL,
    ADD COLUMN `train` SMALLINT NOT NULL,
    ADD COLUMN `zone` SMALLINT NOT NULL,
    ADD COLUMN `zoom` SMALLINT NOT NULL;

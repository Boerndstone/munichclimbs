-- CreateTable
CREATE TABLE `Area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `orientation` VARCHAR(25) NOT NULL,
    `sequence` SMALLINT NOT NULL,
    `online` SMALLINT NOT NULL,
    `image` VARCHAR(25) NOT NULL,
    `header_image` VARCHAR(255) NOT NULL,
    `lat` DECIMAL(4, 2) NOT NULL,
    `lng` DECIMAL(4, 2) NOT NULL,
    `zoom` SMALLINT NOT NULL,
    `rock_resposibility` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rock` ADD CONSTRAINT `Rock_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

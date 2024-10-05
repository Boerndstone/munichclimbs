-- CreateTable
CREATE TABLE `Routes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_id` INTEGER NOT NULL,
    `rock_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `grade` VARCHAR(20) NOT NULL,
    `climbed` SMALLINT NULL,
    `first_ascent` VARCHAR(255) NOT NULL,
    `year_first_ascent` SMALLINT NULL,
    `protecttion` SMALLINT NULL,
    `scale` VARCHAR(100) NOT NULL,
    `grade_no` SMALLINT NULL,
    `rating` SMALLINT NULL,
    `topo_id` SMALLINT NULL,
    `nr` SMALLINT NULL,
    `relates_to_route_id` SMALLINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Topo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rocks_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `with_sector` SMALLINT NULL,
    `svg` TEXT NOT NULL,
    `number` SMALLINT NULL,
    `topo_image` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Routes` ADD CONSTRAINT `Routes_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routes` ADD CONSTRAINT `Routes_rock_id_fkey` FOREIGN KEY (`rock_id`) REFERENCES `Rock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Topo` ADD CONSTRAINT `Topo_rocks_id_fkey` FOREIGN KEY (`rocks_id`) REFERENCES `Rock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

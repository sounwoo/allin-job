-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(5) NOT NULL,
    `nickname` VARCHAR(10) NOT NULL,
    `phone` VARCHAR(13) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `interest` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

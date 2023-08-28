-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
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

-- CreateTable
CREATE TABLE `Outside` (
    `id` VARCHAR(191) NOT NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `view` VARCHAR(191) NOT NULL,
    `mainImage` LONGTEXT NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `enterprise` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `participationPeriod` VARCHAR(191) NOT NULL,
    `personnel` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `preferentialTreatment` VARCHAR(191) NOT NULL,
    `homePage` LONGTEXT NOT NULL,
    `detail` LONGTEXT NOT NULL,

    UNIQUE INDEX `Outside_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intern` (
    `id` VARCHAR(191) NOT NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `view` VARCHAR(191) NOT NULL,
    `mainImage` LONGTEXT NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `enterprise` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `preferentialTreatment` VARCHAR(191) NOT NULL,
    `personnel` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `homePage` LONGTEXT NOT NULL,
    `detail` LONGTEXT NOT NULL,

    UNIQUE INDEX `Intern_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Competition` (
    `id` VARCHAR(191) NOT NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `view` VARCHAR(191) NOT NULL,
    `mainImage` LONGTEXT NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `enterprise` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `Scale` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `benefits` VARCHAR(191) NOT NULL,
    `preferentialTreatment` VARCHAR(191) NOT NULL,
    `homePage` LONGTEXT NOT NULL,
    `detail` LONGTEXT NOT NULL,

    UNIQUE INDEX `Competition_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

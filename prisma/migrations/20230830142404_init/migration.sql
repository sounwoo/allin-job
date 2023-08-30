-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `provider` ENUM('kakao', 'naver', 'google') NOT NULL,
    `name` VARCHAR(5) NOT NULL,
    `nickname` VARCHAR(10) NOT NULL,
    `phone` VARCHAR(13) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `interest` ENUM('literature', 'design', 'IT', 'financial', 'entertainment', 'language', 'entrepreneurship', 'employment') NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keyword` (
    `id` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Keyword_id_key`(`id`),
    UNIQUE INDEX `Keyword_keyword_key`(`keyword`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserKeyword` (
    `userId` VARCHAR(191) NOT NULL,
    `keywordId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `keywordId`)
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
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `participationPeriod` VARCHAR(191) NOT NULL,
    `personnel` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `preferentialTreatment` VARCHAR(191) NOT NULL,
    `homePage` LONGTEXT NOT NULL,
    `detail` LONGTEXT NOT NULL,

    UNIQUE INDEX `Competition_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserKeyword` ADD CONSTRAINT `UserKeyword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserKeyword` ADD CONSTRAINT `UserKeyword_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `Keyword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

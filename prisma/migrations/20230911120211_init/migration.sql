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
CREATE TABLE `Outside` (
    `id` VARCHAR(191) NOT NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `view` INTEGER NOT NULL,
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
    `benefits` VARCHAR(191) NOT NULL,
    `interests` VARCHAR(191) NOT NULL,
    `field` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,

    UNIQUE INDEX `Outside_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Intern` (
    `id` VARCHAR(191) NOT NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `view` INTEGER NOT NULL,
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
    `view` INTEGER NOT NULL,
    `mainImage` LONGTEXT NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `enterprise` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `scale` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,
    `benefits` VARCHAR(191) NOT NULL,
    `homePage` LONGTEXT NOT NULL,
    `interests` VARCHAR(191) NOT NULL,
    `detail` LONGTEXT NOT NULL,

    UNIQUE INDEX `Competition_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `homePage` VARCHAR(191) NOT NULL,
    `turn` VARCHAR(191) NULL,
    `Dday` VARCHAR(191) NOT NULL,
    `resultDay` VARCHAR(191) NOT NULL,
    `applicationPeriod` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Language_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QNet` (
    `id` VARCHAR(191) NOT NULL,
    `detail` LONGTEXT NOT NULL,
    `scheduleInfo` LONGTEXT NOT NULL,
    `jmNm` VARCHAR(191) NOT NULL,
    `engJmNm` VARCHAR(191) NULL,
    `instiNm` VARCHAR(191) NOT NULL,
    `implNm` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QNet_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_id_key`(`id`),
    UNIQUE INDEX `Category_keyword_key`(`keyword`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `turn` VARCHAR(191) NOT NULL,
    `wtReceipt` VARCHAR(191) NOT NULL,
    `wtDday` VARCHAR(191) NOT NULL,
    `wtResultDay` VARCHAR(191) NOT NULL,
    `ptReceipt` VARCHAR(191) NOT NULL,
    `ptDday` VARCHAR(191) NOT NULL,
    `resultDay` VARCHAR(191) NOT NULL,
    `qNetId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ExamSchedule_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserKeyword` ADD CONSTRAINT `UserKeyword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserKeyword` ADD CONSTRAINT `UserKeyword_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `Keyword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QNet` ADD CONSTRAINT `QNet_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamSchedule` ADD CONSTRAINT `ExamSchedule_qNetId_fkey` FOREIGN KEY (`qNetId`) REFERENCES `QNet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

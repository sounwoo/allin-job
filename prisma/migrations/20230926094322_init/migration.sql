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

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Community` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(20) NOT NULL,
    `title` VARCHAR(30) NOT NULL,
    `detail` LONGTEXT NOT NULL,
    `view` INTEGER NOT NULL DEFAULT 0,
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `commentCount` INTEGER NOT NULL DEFAULT 0,
    `createAt` DATETIME NOT NULL DEFAULT NOW(),
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `Community_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(100) NOT NULL,
    `createAt` DATETIME NOT NULL DEFAULT NOW(),
    `userId` VARCHAR(191) NULL,
    `communityId` VARCHAR(191) NULL,

    UNIQUE INDEX `Comment_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommunityLike` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `communityId` VARCHAR(191) NULL,

    UNIQUE INDEX `CommunityLike_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentLike` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `commentId` VARCHAR(191) NULL,

    UNIQUE INDEX `CommentLike_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interest` (
    `id` VARCHAR(191) NOT NULL,
    `interest` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Interest_id_key`(`id`),
    UNIQUE INDEX `Interest_interest_key`(`interest`),
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
CREATE TABLE `UserInterest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `interestId` VARCHAR(191) NOT NULL,
    `keywordId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserInterest_id_key`(`id`),
    PRIMARY KEY (`id`)
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
    `scale` INTEGER NULL,
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
    `view` INTEGER NOT NULL DEFAULT 0,
    `subCategoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QNet_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MainCategory` (
    `id` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MainCategory_id_key`(`id`),
    UNIQUE INDEX `MainCategory_keyword_key`(`keyword`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,
    `mainCategoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SubCategory_id_key`(`id`),
    UNIQUE INDEX `SubCategory_keyword_key`(`keyword`),
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

-- CreateTable
CREATE TABLE `_InterestToKeyword` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_InterestToKeyword_AB_unique`(`A`, `B`),
    INDEX `_InterestToKeyword_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Community` ADD CONSTRAINT `Community_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityLike` ADD CONSTRAINT `CommunityLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityLike` ADD CONSTRAINT `CommunityLike_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentLike` ADD CONSTRAINT `CommentLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentLike` ADD CONSTRAINT `CommentLike_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInterest` ADD CONSTRAINT `UserInterest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInterest` ADD CONSTRAINT `UserInterest_interestId_fkey` FOREIGN KEY (`interestId`) REFERENCES `Interest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInterest` ADD CONSTRAINT `UserInterest_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `Keyword`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QNet` ADD CONSTRAINT `QNet_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `SubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_mainCategoryId_fkey` FOREIGN KEY (`mainCategoryId`) REFERENCES `MainCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamSchedule` ADD CONSTRAINT `ExamSchedule_qNetId_fkey` FOREIGN KEY (`qNetId`) REFERENCES `QNet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterestToKeyword` ADD CONSTRAINT `_InterestToKeyword_A_fkey` FOREIGN KEY (`A`) REFERENCES `Interest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InterestToKeyword` ADD CONSTRAINT `_InterestToKeyword_B_fkey` FOREIGN KEY (`B`) REFERENCES `Keyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

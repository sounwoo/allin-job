/*
  Warnings:

  - You are about to alter the column `createAt` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `createAt` on the `Community` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `createAt` DATETIME NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `Community` MODIFY `createAt` DATETIME NOT NULL DEFAULT NOW();

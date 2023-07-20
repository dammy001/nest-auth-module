/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `failed_login_attempts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `devices` MODIFY `active` TINYINT UNSIGNED NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `verified` TINYINT UNSIGNED NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `failed_login_attempts_user_id_key` ON `failed_login_attempts`(`user_id`);

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `email_verified` DATETIME(3) NULL,
    `phone_no` VARCHAR(50) NOT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `verified` TINYINT UNSIGNED NOT NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_verified_idx`(`email_verified`),
    INDEX `users_deleted_at_idx`(`deleted_at`),
    INDEX `users_created_at_idx`(`created_at`),
    INDEX `users_verified_idx`(`verified`),
    FULLTEXT INDEX `users_first_name_last_name_email_idx`(`first_name`, `last_name`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices` (
    `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(36) NOT NULL,
    `user_agent` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(30) NULL,
    `device_name` VARCHAR(191) NULL,
    `active` TINYINT UNSIGNED NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `devices_active_idx`(`active`),
    INDEX `devices_user_id_device_name_idx`(`user_id`, `device_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_login_attempts` (
    `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(36) NOT NULL,
    `attempts` SMALLINT UNSIGNED NOT NULL,
    `last_attempt_time` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `failed_login_attempts` ADD CONSTRAINT `failed_login_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

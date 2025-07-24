/*
  Warnings:

  - You are about to drop the column `notes` on the `checkout` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `checkout` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to drop the column `paymentProofUrl` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checkout` DROP COLUMN `notes`,
    MODIFY `status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `paymentProofUrl`;

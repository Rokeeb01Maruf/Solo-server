/*
  Warnings:

  - The `createdAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `authProvider` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `updatedAt` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('google', 'solo');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authProvider",
ADD COLUMN     "authProvider" "AuthProvider" NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

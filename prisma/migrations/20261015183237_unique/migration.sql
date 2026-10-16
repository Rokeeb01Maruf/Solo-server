/*
  Warnings:

  - A unique constraint covering the columns `[userId,passwordType]` on the table `otp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "otp_userId_passwordType_key" ON "otp"("userId", "passwordType");

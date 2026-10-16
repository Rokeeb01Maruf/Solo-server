-- DropIndex
DROP INDEX "otp_userId_key";

-- CreateIndex
CREATE INDEX "otp_userId_idx" ON "otp"("userId");

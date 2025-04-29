/*
  Warnings:

  - You are about to drop the column `enablePush` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastPushAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pushTime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "enablePush",
DROP COLUMN "lastPushAt",
DROP COLUMN "pushTime";

-- AlterTable
ALTER TABLE "WeatherPushSetting" ADD COLUMN     "lastPushAt" TIMESTAMP(3);

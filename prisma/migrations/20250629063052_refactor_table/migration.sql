/*
  Warnings:

  - You are about to drop the column `gid` on the `gold` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Weather` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeatherPushSetting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gold_id` to the `gold` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WeatherPushSetting" DROP CONSTRAINT "WeatherPushSetting_userId_fkey";

-- AlterTable
ALTER TABLE "gold" DROP COLUMN "gid",
ADD COLUMN     "gold_id" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Weather";

-- DropTable
DROP TABLE "WeatherPushSetting";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "province" TEXT,
    "area" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather" (
    "id" SERIAL NOT NULL,
    "province" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "weather_date" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "weather_condition" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "temperature_range" TEXT NOT NULL,
    "wind" TEXT NOT NULL,
    "precipitation" TEXT NOT NULL,
    "humidity" TEXT NOT NULL,
    "air_quality" TEXT NOT NULL,
    "air_quality_index" TEXT NOT NULL,
    "live_tips" TEXT NOT NULL,
    "tips" TEXT NOT NULL,

    CONSTRAINT "weather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_push_setting" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enable_push" BOOLEAN NOT NULL DEFAULT true,
    "push_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_push_at" TIMESTAMP(3),

    CONSTRAINT "weather_push_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "weather_push_setting" ADD CONSTRAINT "weather_push_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

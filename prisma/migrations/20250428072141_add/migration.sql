-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enablePush" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastPushAt" TIMESTAMP(3),
ADD COLUMN     "pushTime" TEXT;

-- CreateTable
CREATE TABLE "WeatherPushSetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "enablePush" BOOLEAN NOT NULL DEFAULT true,
    "pushTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherPushSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeatherPushSetting" ADD CONSTRAINT "WeatherPushSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

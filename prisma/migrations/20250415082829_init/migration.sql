-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "province" TEXT,
    "area" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weather" (
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

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

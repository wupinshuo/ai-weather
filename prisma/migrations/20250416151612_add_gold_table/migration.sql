-- CreateTable
CREATE TABLE "gold" (
    "id" SERIAL NOT NULL,
    "gid" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "gold_pkey" PRIMARY KEY ("id")
);

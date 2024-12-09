/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "shop" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_email_key" ON "shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shop_url_key" ON "shop"("url");

-- CreateIndex
CREATE INDEX "shop_url_idx" ON "shop"("url");

-- CreateIndex
CREATE INDEX "shop_email_idx" ON "shop"("email");

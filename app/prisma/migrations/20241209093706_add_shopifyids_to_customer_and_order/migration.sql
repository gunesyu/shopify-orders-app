/*
  Warnings:

  - You are about to drop the column `customerId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_shopId_fkey";

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "customer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "customerId",
DROP COLUMN "shopId",
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "shop_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customer_customer_id_key" ON "customer"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_order_id_key" ON "order"("order_id");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "enumStatus" AS ENUM ('Active', 'InActive');

-- CreateEnum
CREATE TYPE "enumrole" AS ENUM ('admin', 'userAdmin', 'user');

-- CreateEnum
CREATE TYPE "enumOrderBill" AS ENUM ('succeed', 'cancel', 'making');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "tax" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "logo" VARCHAR(50),
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "codeReceipt" VARCHAR(10) NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration" TIMESTAMP(3) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "stock" INTEGER NOT NULL,
    "statusSail" "enumStatus" NOT NULL DEFAULT 'Active',
    "img" TEXT,
    "unitId" INTEGER NOT NULL,
    "productTypeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "detail" TEXT NOT NULL,
    "promotionalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "img" TEXT,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPromotion" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "promotionId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ItemPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "subname" VARCHAR(50) NOT NULL,
    "age" INTEGER NOT NULL,
    "cardId" VARCHAR(30) NOT NULL,
    "userName" TEXT NOT NULL,
    "passWord" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "role" "enumrole" NOT NULL DEFAULT 'user',
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tables" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "stoves" INTEGER NOT NULL,
    "people" INTEGER NOT NULL,
    "expiration" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "receipt" VARCHAR(30) NOT NULL,
    "startOrder" TIMESTAMP(3) NOT NULL,
    "endOrder" TIMESTAMP(3) NOT NULL,
    "peoples" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "branchId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tokenOrder" TEXT,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderBill" (
    "id" SERIAL NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "enumOrderBill" NOT NULL DEFAULT 'making',

    CONSTRAINT "OrderBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTransaction" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderBillId" INTEGER NOT NULL,

    CONSTRAINT "ItemTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" "enumStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemExpenses" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expensesId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "ItemExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userName_key" ON "Employee"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Tables_id_key" ON "Tables"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPromotion" ADD CONSTRAINT "ItemPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tables" ADD CONSTRAINT "Tables_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tables" ADD CONSTRAINT "Tables_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderBill" ADD CONSTRAINT "OrderBill_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransaction" ADD CONSTRAINT "ItemTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTransaction" ADD CONSTRAINT "ItemTransaction_orderBillId_fkey" FOREIGN KEY ("orderBillId") REFERENCES "OrderBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemExpenses" ADD CONSTRAINT "ItemExpenses_expensesId_fkey" FOREIGN KEY ("expensesId") REFERENCES "Expenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemExpenses" ADD CONSTRAINT "ItemExpenses_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

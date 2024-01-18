import { enumStatus } from "@prisma/client";

export interface fetchCompany {
  id: number;
  name: string;
  createdAt: Date;
  address: string;
  tax: string;
  phone: string;
  email: string;
  logo: string;
  status: "Active" | "InActive";
}

export interface fetchBranch {
  key: string;
  id: number;
  name: string;
  codeReceipt: string;
  address: string;
  createdAt: Date;
  expiration: Date;
  phone: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchTableBranch {
  key: string;
  index: number;
  id: number;
  name: string;
  codeReceipt: string;
  address: string;
  createdAt: string;
  expiration: string;
  phone: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchPosition {
  key: string;
  index: number;
  id: number;
  name: string;
  salary: number;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchEmployee {
  id: number;
  name: string;
  subname: string;
  age: number;
  cardId: string;
  userName: string;
  passWord: string;
  companyId: number;
  branchId: number;
  positionId: number;
  role: string;
  status: string;
  branch: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  position: {
    id: number;
    name: string;
  };
  index: number;
  key: string;
}

export interface fetchUnit {
  key: string;
  index: number;
  id: number;
  name: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchProduct {
  index: number;
  key: string;
  id: number;
  name: string;
  cost: number;
  price: number;
  stock: number;
  img: string | null;
  unitId: number;
  productTypeId: number;
  companyId: number;
  productType: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
  };
  statusSail: "Active" | "InActive";
  status: "Active" | "InActive";
}

export interface fetchPromotion {
  index: number;
  key: string;
  id: number;
  name: string;
  detail: string;
  promotionalPrice: number;
  startDate: string | Date;
  endDate: string | Date;
  img: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchItemPromotion {
  id: number;
  productId: number;
  stock: number;
  promotionId: number;
  status: "Active" | "InActive";
}

export interface fetchItemPromotionInPromotion {
  index: number;
  key: string;
  id: number;
  name: string;
  totalItem: number;
  ItemPromotions: ItemPromotions[];
}

export interface ItemPromotions {
  id: number;
  productId: number;
  stock: number;
  promotionId: number;
  status: "Active" | "InActive";
}

export interface fetchTable {
  id: string;
  name: string;
  stoves: number;
  people: number;
  expiration: number;
  branchId: number;
  companyId: number;
  status: "Active" | "InActive";
  index: number;
  key: string;
  branch: {
    id: number;
    name: string;
  };
}

export interface fetchExpenses {
  id: number;
  index: number;
  key: string;
  name: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchItemExpenses {
  id: number;
  price: number;
  orderDate: Date;
  expensesId: number;
  branchId: number;
  status: "Active" | "InActive";
}

export interface fetchProductType {
  index: number;
  key: string;
  id: number;
  name: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface optionSelect {
  value: number;
  label: string;
}

export interface optionSelectPromotionItem {
  id?: number;
  value: number;
  productId: number;
  promotionId: number;
  promotionName: string;
  label: string;
  stock: number;
  status: "Active" | "InActive";
}

export interface fetchOptionAddEmployeeType {
  position: optionSelect[];
  branch: optionSelect[];
}

export interface fetchOptionAddTables {
  branch: optionSelect[];
}

export interface fetchOptionAddProduct {
  unit: optionSelect[];
  productType: optionSelect[];
}

export interface fetchOptionAddExpensesItem {
  expenses: optionSelect[];
}

export interface fetchOptionAddPromotionItem {
  promotion: optionSelect[];
  product: optionSelect[];
}

export interface optionIdName {
  id: number;
  name: string;
}

export interface orderTransactionByBranch {
  id: string;
  name: string;
  stoves: number;
  people: number;
  expiration: number;
  tokenOrder?: string | null;
  transactionOrder: order | null
}

export interface orderTransactionAdd {
  id: string;
  name: string;
  stoves: number;
  people: number;
  expiration: number;
  tokenOrder?: string | null | undefined;
  transactionOrder: order | null
}

export interface order {
  id: string;
  receipt: string;
  startOrder: Date;
  endOrder: Date;
  peoples: number;
  tokenOrder: string | null;
}

export interface fetchTransaction {
  id: string;
  tableId: string;
  receipt: string;
  startOrder: Date;
  endOrder: Date;
  peoples: number;
  totalPrice: number;
  branchId: number;
  tokenOrder: string | null;
  employeeId: number;
  status: "Active" | "InActive";
}

export interface fetchCustomerFrontData {
  id: string;
  tableId: string;
  receipt: string;
  startOrder: Date;
  endOrder: Date;
  peoples: number;
  branch: branchCustomerFrontData;
  tablesData: tablesDataCustomerFrontData;
  productData: productDataCustomerFrontData[];
  promotionData: promotionDataCustomerFrontData[];
}

interface branchCustomerFrontData {
  id: number;
  name: string;
  companyId: number;
}

interface tablesDataCustomerFrontData {
  id: string;
  name: string;
  expiration: number;
  companyId: number;
}

export interface productDataCustomerFrontData {
  id: number;
  name: string;
  companyId: number;
  status: string,
  Products: productData[];
}

export interface productData {
  id: number;
  name: string;
  price: number;
  stock: number;
  img: string | null;
  unit: idNameCustomerFrontData;
  productType: idNameCustomerFrontData;
}

interface idNameCustomerFrontData {
  id: number;
  name: string;
}

export interface ItemPromotionsCustomerFrontData {
  productId: number;
  stock: number;
}

export interface promotionDataCustomerFrontData {
  id: number;
  name: string;
  detail: string;
  promotionalPrice: number;
  startDate: Date;
  endDate: Date;
  img: string | null;
  ItemPromotions: ItemPromotionsCustomerFrontData[];
  productsItemPromotions: (productsItemPromotions | null)[];
}

export interface productsItemPromotions {
  unit: {
    id: number;
    name: string;
  };
  productType: {
    id: number;
    name: string;
  };
  id: number;
  name: string;
  price: number;
  stock: number;
  img: string | null;
}

export interface selectItemPromotion {
  id: number;
  name: string;
}

export interface detailPromotion {
  promotionId: number;
  img: string | null;
  name: string;
  detail: string;
  promotionPrice: number;
  itemPromotionsStock: ItemPromotionsCustomerFrontData[];
}

export interface orderBillType {
  id: number;
  orderDate: Date;
  transactionId: string;
  status: "succeed" | "cancel" | "making" | "process";
}

export interface ItemTransactions {
  id: number;
  qty: number;
  productId: number | null;
  promotionId: number | null;
  orderBillId: number;
}

export interface orderBillTotal {
  id: number;
  orderDate: Date;
  status: "succeed" | "cancel" | "making" | "process";
  ItemTransactions: ItemTransactions[];
}

export interface itemTransactionsType {
  productName: string | null;
  promotionName: string | null;
  unitName: string | null;
  id: number;
  qty: number;
  productId: number | null;
  promotionId: number | null;
  orderBillId: number;
  price: number;
}

export interface orderBillTotalType {
  index: number;
  totalBill: number;
  ItemTransactions: itemTransactionsType[];
  id: number;
  orderDate: Date;
  status: "process" | "succeed" | "cancel" | "making";
}

export interface detailReceiptType {
  companyName: string;
  logo: string | null;
  branchName: string;
  startOrder: Date;
  endOrder: Date;
  tableName: string;
  expiration: number;
  peoples: number;
}

export interface fectOrderBillByTransactionType {
  id: string;
  tableId: string;
  orderBills: orderBills[];
}

export interface orderBills {
  id: number;
  status: string;
  tableName: string;
  transactionId: string;
  orderDate: string;
  ItemTransactions: itemTransactionsType[]
}

export interface enumOrderBill {
  status: "process" | "succeed" | "cancel" | "making";
}

export interface dataVerifyOrderBill {
  orderId: number;
  status: "process" | "succeed" | "cancel" | "making";
}

export interface dateFetchReport {
  branchRpSummaryOfBranchForm: [number];
  rangeRpSummaryOfBranchForm: {
    startDate: string;
    endDate: string;
  }
}

export interface dateFetchExpensesReport {
  branchRpExpensesOfBranchForm: [number];
  rangeRpExpensesOfBranchForm: {
    startDate: string;
    endDate: string;
  }
}

export interface fetchRpSummaryOfBranchType {
  branch: string;
  startDate: string;
  endDate: string;
  resultRpSummaryOfBranch: resultRpSummaryOfBranch[]
}

export interface fetchRpExpensesOfBranchType {
  branch: string;
  startDate: string;
  endDate: string;
  resultRpExpensesOfBranch: resultRpExpensesOfBranch[]
}

export interface resultRpSummaryOfBranch {
  index: number;
  branchId: number;
  branchName: string;
  toalPeoples: number;
  totalPrice: number;
}

export interface resultRpExpensesOfBranch {
  index: number;
  id: number;
  price: number;
  orderDate: Date;
  expensesId: number;
  branchId: number;
  status: enumStatus;
  branchs: {
    name: string;
  };
  expenses: {
    name: string;
  };
  orderShow: string;
}



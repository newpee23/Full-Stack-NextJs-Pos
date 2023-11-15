export interface tokenType {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export interface dataVerifyCompany {
  id?: number;
  name: string;
  address: string;
  tax: string;
  phone: string;
  email: string;
  logo: string;
  status: "Active" | "InActive";
}

export interface dataVerifyBranch {
  id?: number;
  name: string;
  codeReceipt: string;
  address: string;
  createdAt: Date;
  expiration: Date;
  phone: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyPosition {
  id?: number;
  name: string;
  salary: number;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyEmployee {
  id?: number;
  name: string;
  subname: string;
  age: number;
  cardId: string;
  userName: string;
  passWord: string;
  companyId: number;
  branchId: number;
  positionId: number;
  role: "admin" | "userAdmin" | "user";
  status: "Active" | "InActive";
}

export interface dataVerifyUnit {
  id?: number;
  name: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyProductType {
  id?: number;
  name: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyProduct {
  id?: number;
  name: string;
  cost: number;
  price: number;
  stock: number;
  img?: string;
  unitId: number;
  productTypeId: number;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyPromotion {
  id?: number;
  name: string;
  detail: string;
  promotionalPrice: number;
  startDate: Date;
  endDate: Date;
  img?: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyItemPromotion {
  id?: number;
  productId: number;
  stock: number;
  promotionId: number;
  status: "Active" | "InActive";
}

export interface dataVerifyTable {
  id?: string;
  name: string;
  stoves: number;
  people: number;
  expiration: number;
  branchId: number;
  companyId: number;
  status: "Active" | "InActive";
}

export interface promiseDataVerify {
  message: string;
}

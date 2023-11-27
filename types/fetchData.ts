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
  status: "Active" | "InActive";
}

export interface fetchPromotion {
  id: number;
  name: string;
  detail: string;
  promotionalPrice: number;
  startDate: Date;
  endDate: Date;
  img: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface fetchItemPromotion {
  id: number;
  productId: number;
  stock: number;
  promotionId: number;
  expensesId: number;
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
  expensesId: number
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
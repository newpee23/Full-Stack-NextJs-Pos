export interface DataTypeBranch {
  index: number;
  key: string;
  name: string;
  codeReceipt: string;
  address: string;
  createdAt: string;
  expiration: string;
  phone: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface DataTypePosition {
  index: number;
  key: string;
  name: string;
  salary: number;
  companyId: number;
  status: "Active" | "InActive";
}
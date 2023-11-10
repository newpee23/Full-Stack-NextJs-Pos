export interface tokenType {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export interface dataVerifyCompany {
  id? : number;
  name: string;
  address: string;
  tax: string;
  phone: string;
  email: string;
  logo: string;
  status: "Active" | "InActive";
}

export interface dataVerifyBranch {
  id? : number;
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

export interface promiseDataVerify {
  message: string;
}

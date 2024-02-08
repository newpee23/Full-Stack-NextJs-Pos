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
  companyName: string;
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

export interface DataTypeEmployee {
  index: number;
  key: string;
  name: string;
  subname: string;
  position: string;
  userName: string;
  passWord: string;
  role: string;
  companyId: number;
  status: "Active" | "InActive";
}

export interface DataTypeTables {
  index: number;
  key: string;
  name: string;
  stoves: number;
  people: number;
  expiration: number;
  status: "Active" | "InActive";
}


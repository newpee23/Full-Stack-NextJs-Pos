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

export interface fetchPosition {
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
    role: "admin" | "userAdmin" | "user";
    status: "Active" | "InActive";
  }
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

export interface fetchUnit {
    id: number;
    name: string;
    companyId: number;
    status: "Active" | "InActive";
}

export interface fetchProduct {
    id: number;
    name: string;
    cost: number;
    price: number;
    stock: number;
    img: string;
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
}

export interface fetchProductType {
    id: number;
    name: string;
    companyId: number;
    status: "Active" | "InActive";
}
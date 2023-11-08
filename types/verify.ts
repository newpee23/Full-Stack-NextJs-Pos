export interface tokenType {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export interface dataVerifyCompany {
  name: string;
  address: string;
  tax: string;
  phone: string;
  email: string;
  logo: string;
  status: "Active" | "InActive";
}

export interface promiseDataVerify {
  message: string;
  status: boolean;
}

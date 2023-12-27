import { tokenType } from "@/types/verify";

export const verifyToken = (token: string): boolean => {
  if (!token) return false;
  const tokenData = getDataToken(token);
  if (!tokenData) return false;
  const dateNow = Math.floor(Date.now() / 1000);
  const expDateToken: number = tokenData.exp;

  if (expDateToken < dateNow) return false;

  return true;
};

export const getDataToken = (token: string): tokenType | null => {
  try {
    // Split the token into its three parts
    const [header, payload, signature] = token.split(".");
    // Decode the Base64 encoded parts
    const decodedPayload = atob(payload);
    // Parse the JSON data in the decoded parts
    const payloadData: tokenType = JSON.parse(decodedPayload);
    return payloadData;
  } catch (error) {
    return null;
  }
};

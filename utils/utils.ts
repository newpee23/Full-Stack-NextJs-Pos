export const typeNumber = (value: string | string[]): number => {
  const id: number = Array.isArray(value) ? parseInt(value[0], 10) : parseInt(value, 10);
 
  return id;
};

export const generateRunningNumber = (codeReceipt: string | undefined, transactionCount: number): string => {

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);

  // ตรวจสอบว่าเดือนปัจจุบันเป็นเดือนเดียวกับ codeReceipt หรือไม่
  const currentMonth = new Date().getMonth() + 1;
  // ให้เลขรันมี 5 หลัก
  const formattedRunningNumber = (transactionCount + 1).toString().padStart(5, '0');
  // สร้างเลขใหม่ตามรูปแบบ codeReceipt + ปี + เลขรัน
  const newReceiptCode = `${codeReceipt}${currentMonth}${year}${formattedRunningNumber}`;
  return newReceiptCode;
};

export const getMonthNow = (): number => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth returns zero-based month

  return currentMonth;
}

export const getYearNow = (): number => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return currentYear;
}

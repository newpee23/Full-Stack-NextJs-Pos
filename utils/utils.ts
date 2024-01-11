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

// เอาแต่เวลาบวก 7 ชั่วโมง
export const getTime7H = (timestamp: string): string => {
  // Parse the timestamp and get the time
  const dateObject = new Date(timestamp);
  // const time = dateObject.toISOString().split('T')[1].split('.')[0];
  // Add 7 hours to the time
  const newTime = new Date(dateObject.getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[1].split('.')[0];

  return newTime;
}

// เอาแต่วันที่
export const getDate = (timestamp: string): string => {

  // Parse the timestamp and get the date
  const dateObject = new Date(timestamp);
  const day = String(dateObject.getUTCDate()).padStart(2, '0');
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = dateObject.getUTCFullYear();

  // Add 7 hours to the date
  const newDateObject = new Date(dateObject.getTime() + 7 * 60 * 60 * 1000);
  const newDay = String(newDateObject.getUTCDate()).padStart(2, '0');
  const newMonth = String(newDateObject.getUTCMonth() + 1).padStart(2, '0');
  const newYear = newDateObject.getUTCFullYear();

  const originalFormattedDate = `${day}/${month}/${year}`;
  const newFormattedDate = `${newDay}/${newMonth}/${newYear}`;

  return originalFormattedDate;
}

export const getDateQuery = (timestamp: string): string => {

  // Parse the timestamp and get the date
  const dateObject = new Date(timestamp);
  const day = String(dateObject.getUTCDate()).padStart(2, '0');
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = dateObject.getUTCFullYear();

  // Add 7 hours to the date
  const newDateObject = new Date(dateObject.getTime() + 7 * 60 * 60 * 1000);
  const newDay = String(newDateObject.getUTCDate()).padStart(2, '0');
  const newMonth = String(newDateObject.getUTCMonth() + 1).padStart(2, '0');
  const newYear = newDateObject.getUTCFullYear();

  const originalFormattedDate = `${year}-${month}-${day}`;
  const newFormattedDate = `${newYear}-${newMonth}-${newDay}`;

  return originalFormattedDate;
}

export const historyStatus = (status: "process" | "succeed" | "cancel" | "making"): "รอรับออเดอร์" | "สำเร็จ" | "กำลังจัดเตรียม" | "ยกเลิก" => {
  switch (status) {
    case "process":
      return "รอรับออเดอร์"
    case "succeed":
      return "สำเร็จ"
    case "making":
      return "กำลังจัดเตรียม"
    default:
      return "ยกเลิก"
  }
};


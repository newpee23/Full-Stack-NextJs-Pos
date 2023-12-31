import { DateTime } from 'luxon';

const currentDateTime = DateTime.local().setZone('Asia/Bangkok');
const currentDate = currentDateTime.toLocaleString(DateTime.DATE_SHORT); // เลือกรูปแบบที่ถูกต้องสำหรับวันที่
const currentTime = currentDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);

const formattedDateTime = `${currentDate} ${currentTime}`;
export const isoDateTime = DateTime.fromFormat(formattedDateTime, 'M/d/yyyy H:mm', { zone: 'Asia/Bangkok' });

// เช็คว่าเป็น Type Date จริงมั้ย
export const isDate = (value: Date): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime());
};

// เช็คว่า Date มีค่ามากกว่าหรือไม่
export const checkDate1translate2 = (value1: Date, value2: Date): boolean => {
    const date1 = new Date(value1);
    const date2 = new Date(value2);

    if (date1 < date2) return true;

    return false;
};

export const dateTimeIso = (value: Date): Date => {
    const date1 = new Date(value);
    return date1;
}

// Function to check if a string is a valid date
export const isValidDate = (dateString: string): boolean => {
    // Regular expression for a simple datetime format (YYYY-MM-DDTHH:mm:ss)
    const datetimeFormatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    // Check if the string matches the date format
    return datetimeFormatRegex.test(dateString);
}
// แปลง Date เป็น string ไปแสดง
export const formatDate = (date: Date | null): string => {
    if (!date) {
        return ''; // Handle null or undefined values
    }
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    return formattedDate;
};

export const currentDateStrImg = (): string => {
    // Format the date and time components
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}

// บวกเวลาตากนาที
export const addMinutesToCurrentTime = (time: number): Date => {
    try {
        const currentTime = DateTime.local();
        const newTime = currentTime.plus({ minutes: time });
        const adjustedTime = newTime.setZone('Asia/Bangkok');
        const formattedTime = adjustedTime.toISO();
        if (formattedTime) {
          return new Date(formattedTime);
        } else {
          throw new Error('Error formatting time');
        }
      } catch (error) {
        console.error(error);
        throw new Error('Error calculating time');
      }
}

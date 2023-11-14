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
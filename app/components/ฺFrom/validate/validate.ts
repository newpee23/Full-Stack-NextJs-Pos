import { Rule } from "antd/lib/form";
import moment, { Moment } from "moment";

export const validateWhitespace = (rule: Rule, value: string): Promise<void> => {
    if (value && value.trim() !== value) {
        return Promise.reject("ชื่อสาขาไม่ควรมีช่องว่างด้านหน้าหรือด้านหลัง");
    }
    return Promise.resolve();
};

export const validateExpirationDate = (rule: Rule, value: Moment) => {
    const currentDate = moment();
    const currentTime = currentDate.format("HH:mm"); // Extracting time part

    if (value) {
        const selectedTime = value.format("HH:mm");
        if (value.isBefore(currentDate) || (value.isSame(currentDate) && selectedTime < currentTime)) {
            return Promise.reject("วันหมดอายุต้องไม่น้อยกว่าวันที่ปัจจุบัน");
        }
    }

    return Promise.resolve();
};

export const optionStatus: { value: string, label: string }[] = [
    { value: "Active", label: "เปิดใช้งาน" },
    { value: 'InActive', label: 'ไม่เปิดใช้งาน' }
];
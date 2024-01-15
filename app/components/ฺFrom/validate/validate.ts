import { Rule } from "antd/lib/form";
import moment, { Moment } from "moment";

export const validateWhitespace = (rule: Rule, value: string): Promise<void> => {
    if (value && value.trim() !== value) {
        return Promise.reject("ข้อมูลไม่ควรมีช่องว่างด้านหน้าหรือด้านหลัง");
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

export const optionRole: { value: string, label: string }[] = [
    { value: "user", label: "user" },
    { value: 'userAdmin', label: 'userAdmin' }
];

export const parseDateStringToMoment = (dateString: string): Moment => {
    const formatString = 'DD/MM/YYYY H:mm:ss';
    const momentObject = moment(dateString, formatString);

    return momentObject;
}

export const convertStatusToOption = (status: string): { value: string, label: string } => {
    let label = '';

    switch (status) {
        case 'Active':
            label = 'เปิดใช้งาน';
            break;
        case 'InActive':
            label = 'ไม่เปิดใช้งาน';
            break;
        default:
            label = status;
            break;
    }

    return { value: status, label };
}

export const rangeConfig = {
    rules: [{ type: "array" as const, required: true, message: "กรุณาเลือกช่วงเวลา" }],
};

export const branchConfig = {
    rules: [{ type: "array" as const, required: true, message: "กรุณาเลือกสาขา" }],
};

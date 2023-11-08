import { dataVerifyCompany, promiseDataVerify } from "@/types/verify";

export const verifyCompanyBody = (data: dataVerifyCompany): promiseDataVerify[] => {

    let message = "";
    let headMessage = "ไม่พบข้อมูล : ";
    let verifyStatus :promiseDataVerify[] = [];

    const pushData = (data: promiseDataVerify) => {
        verifyStatus.push(data);
    }

    // ตรวจสอบว่าค่าที่ส่งมาครบและเป็นค่าว่างหรือไม่
    if(!data.name.trim()) message += "name, ";
    if(!data.address.trim()) message += "address, ";
    if(!data.tax.trim()) message += "tax, ";
    if(!data.phone.trim()) message += "phone, ";
    if(!data.email.trim()) message += "email, ";
    // if(!data.logo.trim()) message += "logo, ";
    if(!data.status.trim()) message += "status, ";
    // return
    if(message !== "") {
    pushData({message: headMessage + message.slice(0, -2), status: false});   
      return verifyStatus;
    }

    headMessage = "กรุณาระบุ : ";
    // ตรวจสอบว่าค่าที่ส่งมาถูกต้องตาม table Company ต้องการหรือไม่
    if(data.name.length > 50) pushData({message: (verifyStatus.length === 0) ? headMessage += " name สูงสุด 50 อักษร" : " name สูงสุด 50 อักษร" , status: false});   
    if(data.tax.length > 30) pushData({message: (verifyStatus.length === 0) ? headMessage += " tax สูงสุด 30 อักษร" : " tax สูงสุด 30 อักษร" , status: false});   
    if(data.phone.length > 10) pushData({message: (verifyStatus.length === 0) ? headMessage += " phone สูงสุด 10 อักษร" : " phone สูงสุด 10 อักษร" , status: false});  
    if(data.email.length > 50) pushData({message: (verifyStatus.length === 0) ? headMessage += " email สูงสุด 50 อักษร" : " email สูงสุด 50 อักษร" , status: false});  
    if(data.logo.length > 50) pushData({message: (verifyStatus.length === 0) ? headMessage += " logo สูงสุด 50 อักษร" : " logo สูงสุด 50 อักษร" , status: false});  
    if(data.status !== "Active" && data.status !== "InActive") pushData({message: (verifyStatus.length === 0) ? headMessage += " status เป็น Active หรือ InActive เท่านั้น" : " status เป็น Active หรือ InActive เท่านั้น" , status: false}); 
    // return
    return verifyStatus;
}
import { dataVerifyOrderBill } from "@/types/fetchData";
import { fectOrderBillById, updateOrderBillStatus, verifyOrderBillStatus } from "@/utils/orderBill";
import { NextApiResponse } from "next";

export const handleUpdateOrderBillStatus = async (body: dataVerifyOrderBill, res: NextApiResponse) => {
    // VerifyOrderBillStatus
    const verifyData = verifyOrderBillStatus(body);
    if (verifyData.length > 0) return res.status(404).json({ message: verifyData, orderBill: null, status: false });
    // checkOrderBillById
    const orderBill = await fectOrderBillById(body.orderId);
    if (!orderBill) return res.status(404).json({ message: [{ message: `เกิดข้อผิดพลาด: ไม่พบข้อมูล fectOrderBillById` }], orderBill: null, status: false });
    // updateOrderBill
    const updateStatus = await updateOrderBillStatus(body.orderId, body.status);
    if (!updateStatus) return res.status(404).json({ message: [{ message: `เกิดข้อผิดพลาด: updateOrderBillStatus` }], orderBill: null, status: false });

    return res.status(200).json({ message: [{ message: "บันทึกข้อมูลสำเร็จ" }], orderBill: orderBill, status: true });
}

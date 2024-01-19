import { dataVerifyTable } from "@/types/verify";
import { getBranchById } from "@/utils/branch";
import { getCompanyById } from "@/utils/company";
import { deleteDataTables, fetchAllTable, fetchTableBranchId, fetchTableById, fetchTableCompanyId, fetchTableNameBybranchId, insertTable, updateDataTables, verifyTableBody } from "@/utils/table";
import { NextApiResponse } from "next";

export const handleAddTable = async (body: dataVerifyTable, res: NextApiResponse) => {
    // VerifyPromotionData
    const verifyTable = verifyTableBody(body);
    if (verifyTable.length > 0) return res.status(404).json({ message: verifyTable, tables: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: `No company found with companyId : ${body.companyId}`, tables: null, status: false });
    // check BranchId
    const checkBranchId = await getBranchById(body.branchId);
    if (!checkBranchId) return res.status(404).json({ message: `No branch found with branchId : ${body.branchId}`, tables: null, status: false });
    // check NameBy branchId
    const checkName = await fetchTableNameBybranchId(body.name, body.branchId);
    if (checkName) return res.status(404).json({ message: `Found information name : ${body.name} has already been used in the system.`, tables: null, status: false });
    // add Tables
    const addTables = await insertTable(body);
    if (!addTables) return res.status(404).json({ message: "บันทึกข้อมูลไม่สำเร็จ", tables: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", tables: addTables, status: true });
}

export const handleGetTableById = async (res: NextApiResponse, id: string) => {
    const tables = await fetchTableById(id);
    if (!tables) return res.status(200).json({ message: `No tables found with Id : ${id}`, tables: null, status: false });

    return res.status(200).json({ message: "Tables found", promotion: tables, status: true });
}

export const handleGetTableByBranchId = async (res: NextApiResponse, branchId: number) => {
    const tables = await fetchTableBranchId(branchId);
    if (!tables || (Array.isArray(tables) && tables.length === 0)) return res.status(200).json({ message: `No tables found with branchId : ${branchId}`, tables: null, status: false });

    return res.status(200).json({ message: "Tables found", tables: tables, status: true });
}

export const handleGetTableByCompanyId = async (res: NextApiResponse, companyId: number) => {
    const tables = await fetchTableCompanyId(companyId);
    if (!tables || (Array.isArray(tables) && tables.length === 0)) return res.status(200).json({ message: `No tables found with companyId : ${companyId}`, tables: null, status: false });

    return res.status(200).json({ message: "Tables found", tables: tables, status: true });
}

export const handleGetAllTable = async (res: NextApiResponse) => {
    const tables = await fetchAllTable();
    if (!tables || (Array.isArray(tables) && tables.length === 0)) return res.status(200).json({ message: `No tables found`, tables: null, status: false });

    return res.status(200).json({ message: "Tables found", tables: tables, status: true });
}

export const handleUpdateTable = async (body: dataVerifyTable, res: NextApiResponse) => {
    if (!body.id) return res.status(404).json({ message: [{message: "Please specify tablesId."}], tables: null, status: false });
    // VerifyPromotionData
    const verifyTable = verifyTableBody(body);
    if (verifyTable.length > 0) return res.status(404).json({ message: verifyTable, tables: null, status: false });
    // check TablesById
    const checkTableId = await fetchTableById(body.id);
    if (!checkTableId) return res.status(404).json({ message: [{message: `No tables found with id : ${body.id}`}], tables: null, status: false });
    // check companyId
    const checkCompanyId = await getCompanyById(body.companyId);
    if (!checkCompanyId) return res.status(404).json({ message: [{message: `No company found with companyId : ${body.companyId}`}], tables: null, status: false });
    // check BranchId
    const checkBranchId = await getBranchById(body.branchId);
    if (!checkBranchId) return res.status(404).json({ message: [{message: `No branch found with branchId : ${body.branchId}`}], tables: null, status: false });
    // check NameBy branchId
    const checkName = await fetchTableNameBybranchId(body.name, body.branchId, body.id);
    if (checkName) return res.status(404).json({ message: [{message: `Found information name : ${body.name} has already been used in the system.`}], tables: null, status: false });
    // updateTables
    const updateTables = await updateDataTables(body, body.id);
    if (!updateTables) return res.status(404).json({ message: [{message: "บันทึกข้อมูลไม่สำเร็จ"}], tables: null, status: false });

    return res.status(200).json({ message: "บันทึกข้อมูลสำเร็จ", tables: updateTables, status: true });
}

export const handleDeleteTable = async (res: NextApiResponse, id: string) => {
    const tables = await fetchTableById(id);
    if (!tables) return res.status(404).json({ message: `No tables found with Id : ${id}`, tables: null, status: false });
    const deleteTables = await deleteDataTables(id);
    if (!deleteTables) return res.status(404).json({ message: "An error occurred deleting data.", tables: null, status: false });

    return res.status(200).json({ message: "Successfully deleted data", tables: deleteTables, status: true });
}

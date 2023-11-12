import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../checkToken";
import { deleteDataPosition, getAllPosition, getPositionByIdByCompanyId } from "@/utils/position";
import { typeNumber } from "@/utils/utils";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  try {
    // getPosition By Id
    if(query.id) {
      return await handleGetPositionById(res, typeNumber(query.id));
    }
    // getPosition By Id
    if(query.companyId) {
      return await handleGetPositionByCompanyId(res, typeNumber(query.companyId));
    }
    //  getAllPosition
    return await handleGetAllPosition(res);
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error",status: false });
  }
};

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {

  const { query } = req;

  try {
    if(!query.id){
      return res.status(404).json({ message: "Please specify positionId", position: null , status: true});
    }
    // DeletePosition By Id
    return await handleDeletePosition(res, typeNumber(query.id));
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error",status: false });
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    GET(req, res);
  } else if (req.method === "POST") {
  //   POST(req, res);
  } else if (req.method === "PUT") {
  //   PUT(req, res);
  } else if (req.method === "DELETE") {
    DELETE(req, res);
  } else {
    res.status(405).end();
  }
};

const handleGetPositionById = async (res: NextApiResponse, id: number) => {
  const position = await getPositionByIdByCompanyId(id, "id");
  if (!position || (Array.isArray(position) && position.length === 0)) {
    return res.status(404).json({ message: `No position found with Id : ${id}`, position: null, status: false });
  }
  
  return res.status(200).json({ message: "Position found", position, status: true });
}
 
const handleGetPositionByCompanyId = async (res: NextApiResponse, companyId: number) => {
  const position = await getPositionByIdByCompanyId(companyId, "companyId");
  if (!position || (Array.isArray(position) && position.length === 0)) {
    return res.status(404).json({ message: `No position found with companyId : ${companyId}`, position: null, status: false });
  }

  return res.status(200).json({ message: "Position found", position, status: true });
}

const handleGetAllPosition = async (res: NextApiResponse) => {
  const position = await getAllPosition();
  if (!position || position.length === 0) {
    return res.status(404).json({ message: "No positions found", position: null, status: false });
  }
    
  return res.status(200).json({ message: "Position found", position: position, status: true });
}

const handleDeletePosition =async (res: NextApiResponse,id: number) => {
  const position = await getPositionByIdByCompanyId(id, "id");
  if (!position || (Array.isArray(position) && position.length === 0)) {
    return res.status(404).json({ message: `No position found with Id : ${id}`, position: null, status: false });
  }

  const deletePosition = await deleteDataPosition(id);
  if(!deletePosition){
    return res.status(404).json({ message: "An error occurred deleting data.", position: null , status: false});
  }
  return  res.status(200).json({ message: "Successfully deleted data", position: position, status: true });
}
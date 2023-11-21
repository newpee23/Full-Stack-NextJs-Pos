import React from 'react'
import { FaRegEdit } from "react-icons/fa";

type Props = {
  label: string;
  name?: string;
  onClick: () => void;
};

const EditBtn = ({ label, name, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="text-yellow-500 flex m-1 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-yellow-500 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
      <FaRegEdit />
      <span className="ml-1">{label}</span>
    </button>
  )
}

export default EditBtn
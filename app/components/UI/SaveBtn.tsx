import { SaveOutlined } from '@ant-design/icons'
import React from 'react'

type Props = {
    label: string;
    
  };

const SaveBtn = ({ label }: Props) => {
  return (
    <button
    type="submit"
    className="text-white bg-orange-600 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-orange-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105"
  >
    <SaveOutlined />
    <span className="ml-1">{label}</span>
  </button>
  )
}

export default SaveBtn
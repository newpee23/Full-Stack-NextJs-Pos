import { SyncOutlined } from '@ant-design/icons';
import React from 'react'

type Props = {
  label: string;
  onClick: () => void;
};

const RefreshBtn = ({ label, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-orange-500 m-3 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl transition-transform transform hover:scale-105"
    >
      <SyncOutlined />
      <span className="ml-1">{label}</span>
    </button>
  )
}

export default RefreshBtn
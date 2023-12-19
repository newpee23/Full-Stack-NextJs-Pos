import { CopyOutlined } from "@ant-design/icons";

type Props = {
  label: string;
  onClick: () => void;
};

const PrintReceipt = ({ label, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="text-orange-500 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
      <CopyOutlined />
      <span className="ml-1">{label}</span>
    </button>
  );
}

export default PrintReceipt;

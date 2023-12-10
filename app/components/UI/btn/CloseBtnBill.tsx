import { CloseCircleOutlined } from "@ant-design/icons";

type Props = {
  label: string;
  onClick: () => void;
};

const CloseBtnBill = ({ label, onClick }: Props) => {
  return (
    <button type="button" onClick={onClick} className="text-red-500 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-red-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
      <CloseCircleOutlined />
      <span className="ml-1">{label}</span>
    </button>
  );
}

export default CloseBtnBill;

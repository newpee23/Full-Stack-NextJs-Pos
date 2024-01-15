import { FaFileExcel } from "react-icons/fa";

type Props = {
    onClick: () => void;
};

const ExportExcelBtn = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="flex items-center text-green-600 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-green-700 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
            <FaFileExcel />
            <span className="ml-1">ดาวโหลดข้อมูล</span>
        </button>
    );
}

export default ExportExcelBtn;

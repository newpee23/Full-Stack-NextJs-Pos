import { IoSearchSharp } from "react-icons/io5";

const SearchBtn = () => {
    return (
        <button type="submit" className="text-orange-500 flex items-center py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-orange-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
            <IoSearchSharp />
            <span className="ml-1">ค้นหาข้อมูล</span>
        </button>
    );
}

export default SearchBtn;

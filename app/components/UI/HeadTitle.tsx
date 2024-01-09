import { MdProductionQuantityLimits } from "react-icons/md";
import ModalCloseShowProduct from "./modal/ModalCloseShowProduct";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDataProduct } from "@/app/api/product";

interface openModalType {
    modalCloseShowProduct: boolean;
}

function HeadTitle() {

    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataProduct(session?.user.accessToken, session?.user.company_id);
    const [openModal, setOpenModal] = useState<openModalType>({
        modalCloseShowProduct: false,
    });

    const handleRefresh = async () => {
        remove();
        return await refetch();
    };

    const handleButtonClick = () => {
        setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: !prev.modalCloseShowProduct }));
    };

    useEffect(() => {
        const refreshSailShoeProduct = () => {
            if(openModal.modalCloseShowProduct){
                handleRefresh();
            }
        }

        return refreshSailShoeProduct();
      }, [openModal]);
      
    return (
        <div className={`p-4 w-full top-0 bg-white shadow-md rounded-lg flex justify-between`}>
            <div className="flex items-center drop-shadow-md justify-between">
                <div>
                    <button onClick={handleButtonClick} type="button" className="text-gray-700 py-2 px-3 border rounded-md text-sm drop-shadow-md hover:bg-gray-600 hover:text-white hover:drop-shadow-xl whitespace-nowrap transition-transform transform hover:scale-105">
                        <span className="flex items-center">
                            <MdProductionQuantityLimits className="mr-1" /> แสดงการขายสินค้ารายตัว
                        </span>
                    </button>
                    {openModal.modalCloseShowProduct && <ModalCloseShowProduct data={data} isLoading={isLoading} isError={isError} modalCloseShowProduct={openModal.modalCloseShowProduct} setOpenModal={() => setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: false }))}/>}
                </div>
            </div>
        </div>
    );
}

export default HeadTitle;

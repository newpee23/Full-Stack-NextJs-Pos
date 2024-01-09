import { Empty, Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import ListShowSaleProduct from '../list/ListShowSaleProduct';
import { fetchProduct } from '@/types/fetchData';
import ErrPage from '../../ErrPage';
import SkeletonTable from '../loading/SkeletonTable';

interface Props {
    modalCloseShowProduct: boolean;
    setOpenModal: Dispatch<SetStateAction<{
        modalCloseShowProduct: boolean;
    }>>;
    data: fetchProduct[] | undefined;
    isLoading: boolean;
    isError: boolean;
}

const ModalCloseShowProduct = ({ data,isLoading ,isError , modalCloseShowProduct, setOpenModal }: Props) => {

    if(isError){
        return <ErrPage />
    }

    return (
        <div>
            <Modal title="แสดงการขายสินค้ารายตัว" open={modalCloseShowProduct} footer={null} onCancel={() => setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: false }))}>
                {isLoading ? <SkeletonTable /> :
                    data ? <ListShowSaleProduct data={data} /> : <Empty />
                }
            </Modal>
        </div>
    );
}

export default ModalCloseShowProduct;

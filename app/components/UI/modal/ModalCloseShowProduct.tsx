import { useDataProduct } from '@/app/api/product';
import { Empty, Modal } from 'antd';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import SkeletonTable from '../loading/SkeletonTable';
import ErrPage from '../../ErrPage';
import ListShowSaleProduct from '../list/ListShowSaleProduct';

interface Props {
    modalCloseShowProduct: boolean;
    setOpenModal: Dispatch<SetStateAction<{
        modalCloseShowProduct: boolean;
    }>>;
}

const ModalCloseShowProduct = ({ modalCloseShowProduct, setOpenModal }: Props) => {

    const { data: session } = useSession();
    const { data, isLoading, isError, refetch, remove } = useDataProduct(session?.user.accessToken, session?.user.company_id);

    const handleRefresh = async () => {
        remove();
        return await refetch();
    };

    if (isError) {
        return <ErrPage onClick={handleRefresh} />;
    }

    return (
        <div>
            <Modal title="แสดงการขายสินค้ารายตัว" open={modalCloseShowProduct} footer={null} onCancel={() => setOpenModal((prev) => ({ ...prev, modalCloseShowProduct: false }))}>
                {isLoading ?
                    <SkeletonTable />
                    :
                    data ? <ListShowSaleProduct data={data} handleRefresh={handleRefresh}/> : <Empty />
                }
            </Modal>
        </div>
    );
}

export default ModalCloseShowProduct;

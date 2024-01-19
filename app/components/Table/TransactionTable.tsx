import { useDataTransaction } from '@/app/api/transaction';
import { useSession } from 'next-auth/react';
import React from 'react'
import SkeletonTable from '../UI/loading/SkeletonTable';
import ErrPage from '../ErrPage';
import { SegmentedValue } from 'antd/lib/segmented';
import CardTransaction from '../UI/card/CardTransaction';
import { orderTransactionByBranch } from '@/types/fetchData';
import EmptyNodata from '../UI/EmptyNodata';
import RefreshBtn from '../UI/btn/RefreshBtn';

type Props = {
  segmentedShow: SegmentedValue;
}

const TransactionTable = ({ segmentedShow }: Props) => {

  const { data: session } = useSession();
  const { data, isLoading, isError, refetch, remove } = useDataTransaction(session?.user.accessToken, session?.user.branch_id);

  const handleRefresh = () => {
    remove();
    return refetch();
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return <ErrPage onClick={handleRefresh} />;
  }

  const renderCardByTable = (dataOrder: orderTransactionByBranch[]) => {
    return dataOrder.map((item) => {
      const isOpen = Boolean(item.transactionOrder);
      return (
        <CardTransaction key={item.id} data={item} isOpen={isOpen} onClick={handleRefresh} />
      );
    });
  }

  const renderCardByTransaction = (dataOrder: orderTransactionByBranch[]) => {
    const hasTransactionOrder = dataOrder.some((item) => Boolean(item.transactionOrder));

    return hasTransactionOrder ? (
      <div className="grid p-5 gap-5 grid-cols-1 mdl:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dataOrder.map((item) => {
          const isOpen = Boolean(item.transactionOrder);
          return (
            item.transactionOrder ? (
              <CardTransaction key={item.id} data={item} isOpen={isOpen} onClick={handleRefresh} />
            ) : null
          );
        })}
      </div>
    ) : <EmptyNodata />;
  };

  return (
    <div>
      <div className="text-right p-2 pb-0">
        <RefreshBtn label="Refresh Data" onClick={handleRefresh} />
      </div>
      {segmentedShow === "1" ? (
        data && data?.length > 0 ? (
          <div className="grid p-5 gap-5 grid-cols-1 mdl:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderCardByTable(data)}
          </div>
        ) : (
          <EmptyNodata />
        )
      ) :
        data && data?.length > 0 ? (
          renderCardByTransaction(data)
        ) : <EmptyNodata />}
    </div>
  )
}

export default TransactionTable;
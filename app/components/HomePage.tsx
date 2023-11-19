import React from 'react';
import { Empty } from 'antd';
import { useSession } from 'next-auth/react';
import { useDataEmployee } from '../api/fetch/fetchEmployee';
import SkeletonTable from './UI/SkeletonTable';
import ErrPage from './ErrPage';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  // const { data, isLoading, isError, refetch, remove } = useDataEmployee(session?.user.accessToken, session?.user.id);

  // if (isLoading) {
  //   return <SkeletonTable />;
  // }

  // if (isError) {
  //    return router.push("/auth", { scroll: false });
  // }

  
  return  (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};

export default HomePage;

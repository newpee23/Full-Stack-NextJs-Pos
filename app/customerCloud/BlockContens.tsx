// BlockContens.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import HeadTitle from '../components/UI/HeadTitle';
import HomePage from '../components/HomePage';
import BranchTable from '../components/Table/BranchTable';
import PositionTable from '../components/Table/PositionTable';
import EmployeeTable from '../components/Table/EmployeeTable';
import TablesTable from '../components/Table/TablesTable';
import ExpensesTable from '../components/Table/ExpensesTable';
import ProductTypeTable from '../components/Table/ProductTypeTable';
import UnitTable from '../components/Table/UnitTable';
import ProductTable from '../components/Table/ProductTable';
import PromotionTable from '../components/Table/PromotionTable';
import ExpensesItemFrom from '../components/ฺFrom/ExpensesItemFrom';
import PromotionItemTable from '../components/Table/PromotionItemTable';
import OrderBillDetail from '../components/OrderBillDetail';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setShowOrderBillMaking, setShowOrderBillProcess } from '../store/slices/showSlice';
import RpSummaryOfBranch from '../components/report/RpSummaryOfBranch';
import RpExpensesOfBranch from '../components/report/RpExpensesOfBranch';
import { useSession } from 'next-auth/react';
import HomeAdminPage from '../components/HomeAdminPage';

type Props = { idComponents: React.Key | null; };

const BlockContens = (props: Props) => {

  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { showOrderBillMaking, showOrderBillProcess } = useAppSelector((state) => state?.showSlice);
  const [component, setComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    const loadComponents = () => {
      dispatch(setShowOrderBillProcess(false));
      dispatch(setShowOrderBillMaking(false));
      switch (props.idComponents) {
        case '1':
          if(session?.user.role === "admin"){
            setComponent(<HomeAdminPage />);
            break;
          }
          setComponent(<HomePage />);
          break;
        case '2':
          setComponent(<BranchTable />);
          break;
        case '3':
          setComponent(<TablesTable />);
          break;
        case '5':
          setComponent(<PositionTable />);
          break;
        case '6':
          setComponent(<EmployeeTable />);
          break;
        case '7':
          setComponent(<ExpensesTable />);
          break;
        case '8':
          setComponent(<ExpensesItemFrom />);
          break;
        case '11':
          setComponent(<ProductTypeTable />);
          break;
        case '12':
          setComponent(<UnitTable />);
          break;
        case '14':
          setComponent(<ProductTable />);
          break;
        case '15':
          setComponent(<PromotionTable />);
          break;
        case '16':
          setComponent(<PromotionItemTable />);
          break;
        case '17':
          setComponent(<RpSummaryOfBranch />);
          break;
        case '18':
          setComponent(<RpExpensesOfBranch />);
          break;
        case '19':
          setComponent(<HomeAdminPage />);
          break;
        case '20':
          setComponent(<RpExpensesOfBranch />);
          break;
        case '21':
          setComponent(<RpExpensesOfBranch />);
          break;
        // เพิ่ม case ตามต้องการ
        default:
          setComponent(null);
      }
    };
    loadComponents();
  }, [props.idComponents]);

  return (
    <section className="w-full">
      { session?.user.role !== "admin" && 
        <div className="flex justify-center m-3">
          <HeadTitle />
        </div>  
      }
      <div className="flex flex-col justify-center m-3 bg-white shadow-md rounded-lg">
        {showOrderBillProcess ? <OrderBillDetail title="แสดงออเดอร์ประจำวัน" /> : showOrderBillMaking ? <OrderBillDetail title="แสดงออเดอร์กำลังเตรียมประจำวัน" /> : component}
      </div>
    </section>
  );
};

export default BlockContens;

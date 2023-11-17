// BlockContens.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import HomePage from './components/HomePage';
import HeadTitle from '../components/UI/HeadTitle';
import BranchPage from './components/BranchPage';

type Props = { idComponents: React.Key | null;};

const BlockContens = (props: Props) => {
  const [component, setComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    const loadComponents = () => {
      switch (props.idComponents) {
        case '1':
          setComponent(<HomePage />);
          break;
        case '2':
          setComponent(<BranchPage />);
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
      <div className="flex justify-center m-3">
        <HeadTitle />
      </div>
      <div className="flex flex-col justify-center m-3 bg-white shadow-md rounded-lg">
        {component}
      </div>
    </section>
  );
};

export default BlockContens;

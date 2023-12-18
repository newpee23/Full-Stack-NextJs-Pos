import React from 'react'
import type { CountdownProps } from 'antd';
import { Col, Row, Statistic } from 'antd';
import Countdown from 'antd/lib/statistic/Countdown';

type Props = {
  startOrder: Date;
  time: number;
}

const CountdownTime = ({ startOrder , time }: Props) => {

  // ปรับเวลานับถอยหลังให้นับจากเวลาปัจจุบัน
  const now = new Date(startOrder).getTime();

  const deadline = now + time * 60 * 1000;

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
  };

  return (
    <div className="w-full flex justify-center">
      <div>
        <Countdown title="" value={deadline} onFinish={onFinish} />
      </div>
      <div className="flex items-center mt-2">
        <span className="ant-statistic-content-value ml-2">ชั่วโมง</span>
      </div>
    </div>
  )
}

export default CountdownTime;


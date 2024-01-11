import React, { useEffect } from "react"
import type { CountdownProps } from "antd";
import Countdown from "antd/lib/statistic/Countdown";

type Props = {
  startOrder: Date;
  time: number;
  setBeOver?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CountdownTime = ({ startOrder , time , setBeOver }: Props) => {

  // ปรับเวลานับถอยหลังให้นับจากเวลาปัจจุบัน
  const now = new Date(startOrder).getTime();
  const dateNow = new Date().getTime();
  const deadline = now + time * 60 * 1000;
  const deadlineNow = dateNow + 0 * 60 * 1000;

  const onFinish: CountdownProps["onFinish"] = () => {
    if(setBeOver){
      setBeOver(true);
    }
  };

  useEffect(() => {
    const checkDateState = () => {
      if(deadlineNow > deadline){
        if(setBeOver){
          setBeOver(true);
        }
      }
    }

    return () => checkDateState();
}, []);

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


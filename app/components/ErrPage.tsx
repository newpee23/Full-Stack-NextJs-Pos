import { FC } from "react";
import { Button, Result } from "antd";


type ErrPageProps = {
    onClick?: () => void;
};

const ErrPage = ({ onClick }: ErrPageProps) => (
    <div className="text-center m-3">
        <Result status="error" className="pb-3" title="พบข้อผิดพลาด" subTitle="กรุณาลองใหม่อีกครั้ง" />
        {onClick &&
            <Button className="bg-orange-600 max-w-[150px]" onClick={onClick}>
                <p className="text-white">Refresh Data</p>
            </Button>
        }
    </div>
);

export default ErrPage;
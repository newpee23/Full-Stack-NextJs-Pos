import { Skeleton } from "antd";

const SkeletonTable = () => {
    return (
        <div className="p-3">
            <div className="mb-1"> <Skeleton.Input active={true} size="small" block={true} /></div>
            <div className="mb-1"> <Skeleton.Input active={true} size="small" block={true} /></div>
            <div className="mb-1"> <Skeleton.Input active={true} size="small" block={true} /></div>
            <div className="mb-1"> <Skeleton.Input active={true} size="small" block={true} /></div>
            <div className="mb-1"> <Skeleton.Input active={true} size="small" block={true} /></div>
        </div>
    );
};

export default SkeletonTable;

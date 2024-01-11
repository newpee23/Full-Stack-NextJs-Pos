import { historyStatus } from "@/utils/utils";

interface Props {
    status: "process" | "succeed" | "cancel" | "making";
}
const TimeLineHistoryBill = ({status}: Props) => {
  return (
    <div className="text-xs text-right">
      <p>{historyStatus(status)}</p>
    </div>
  );
};

export default TimeLineHistoryBill;

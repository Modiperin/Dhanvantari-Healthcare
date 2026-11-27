import TableGrid from "../../../../components/table/TableGrid";
import { HeaderType } from "../../../../utils/types";

const headerForFollowUp = [
  {
    name: "Doctor Name",
    value: "doctorName",
    _class: "col-span-5",
  },
  {
    name: "FollowUp Date",
    value: "date",
    _class: "col-span-5",
  },
  {
    name: "Continue",
    value: "continue",
    _class: "col-span-2",
    type: HeaderType.checkbox,
  },
];

const FollowUpDetails = ({ followUpData = [], setFollowUp, setFollowUpId }) => {
  const handleChecked = (val) => {
    setFollowUpId("");
    if (followUpData.find((ele) => ele.id === val)?.continue === true) {
      setFollowUp((prev) =>
        prev.map((ele) => (ele.id === val ? { ...ele, continue: false } : ele))
      );
    } else {
      setFollowUpId(val);
      setFollowUp((prev) =>
        prev.map((ele) =>
          ele.id === val
            ? { ...ele, continue: true }
            : { ...ele, continue: false }
        )
      );
    }
  };
  return (
    <div className="card flex flex-col gap-3">
      <h2 className="title">Follow-up Details</h2>
      <TableGrid
        data={followUpData}
        columns={headerForFollowUp}
        isCompressView={true}
        handleChecked={handleChecked}
        from="followUp"
      />
    </div>
  );
};

export default FollowUpDetails;

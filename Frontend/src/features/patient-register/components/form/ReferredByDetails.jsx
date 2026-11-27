import CommonInput from "../../../../components/CommonInput";
import { useFormContext } from "react-hook-form";

const ReferredByDetails = () => {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <div className="flex card flex-col gap-3">
      <h2 className="title">Referral Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4">
          <CommonInput
            labelName="Referred By"
            id="referredBy"
            name="referredBy"
            register={register}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferredByDetails;

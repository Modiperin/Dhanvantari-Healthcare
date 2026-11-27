import { useFormContext } from "react-hook-form";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import CommonInput from "../../../../components/CommonInput";
import { relationOptions } from "../../helper";

const EmergencyContactDetails = () => {
  const { register, control, formState } = useFormContext();
  const { errors } = formState;
  return (
    <div className="flex flex-col gap-3">
      <h2 className="title">Emergency Contact Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2">
          <CommonInput
            labelName="Name"
            id="emergencyContact.name"
            name="emergencyContact.name"
            register={register}
            errors={errors}
          />
        </div>
        {/* Relationship  */}
        <div className="col-span-2">
          <AntSearchableSelector
            id="emergencyContact.relationship"
            name="emergencyContact.relationship"
            labelName="Relationship"
            options={relationOptions}
            control={control}
            errors={errors}
          />
        </div>
        {/* Contact Number */}
        <div className="col-span-4">
          <CommonInput
            labelName="Contact"
            id="emergencyContact.phoneNo"
            name="emergencyContact.phoneNo"
            register={register}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactDetails;

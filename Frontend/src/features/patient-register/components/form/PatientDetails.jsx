import React from "react";
import CommonInput from "../../../../components/CommonInput";
import { useFormContext } from "react-hook-form";
import OptionGroup from "../../../../components/OptionGroup";
import { bloodGroupOptions, genderOptions } from "../../helper";
import { handleDOBChange } from "../../../../utils/common";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import AntDatePicker from "../../../../components/AntDatePicker";

const PatientDetails = () => {
  const { register, control, setValue, formState } = useFormContext();
  const { errors } = formState;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="title">Patient Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4">
          <CommonInput
            labelName="Name(As per Adharcard)"
            id="name"
            name="name"
            register={register}
            errors={errors}
            required={true}
          />
        </div>
        <div className="flex col-span-4 w-full items-center">
          <OptionGroup
            name="gender"
            // labelName="Gender"
            options={genderOptions}
            register={register}
            setValue={setValue}
            required={true}
            errors={errors}
          />
          <AntSearchableSelector
            id="bloodGroup"
            name="bloodGroup"
            label="Blood Group"
            control={control}
            errors={errors}
            options={bloodGroupOptions}
          />
        </div>

        {/* DOB */}
        <div className="col-span-3">
          <AntDatePicker
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date of Birth"
            control={control}
            errors={errors}
            required={true}
            onChange={(date, dateString) =>
              handleDOBChange(date, dateString, setValue)
            }
          />
        </div>

        {/* Age */}
        <div className="col-span-1">
          <CommonInput
            labelName="Age"
            id="age"
            name="age"
            register={register}
            errors={errors}
            disabled={true}
            type="number"
          />
        </div>
        {/* Phone Number */}
        <div className="col-span-4">
          <CommonInput
            labelName="Phone"
            id="phoneNo"
            name="phoneNo"
            register={register}
            errors={errors}
            required={true}
          />
        </div>

        {/* Email ID */}
        <div className="col-span-4">
          <CommonInput
            labelName="Email"
            id="email"
            name="email"
            register={register}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;

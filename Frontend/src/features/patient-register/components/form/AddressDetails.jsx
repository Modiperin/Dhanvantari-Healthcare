import React from "react";
import CommonInput from "../../../../components/CommonInput";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import { countryOptions, stateOptions } from "../../helper";
import { useFormContext } from "react-hook-form";

const AddressDetails = () => {
  const { register, control, formState } = useFormContext();
  const { errors } = formState;

  return (
    <>
      <h2 className="title">Address Details</h2>
      <div className="grid grid-cols-4 gap-3">
        {/* House Name */}
        <div className="col-span-2">
          <CommonInput
            labelName="House Name"
            id="address.houseName"
            name="address.houseName"
            register={register}
            errors={errors}
          />
        </div>
        {/* Locality */}
        <div className="col-span-2">
          <CommonInput
            labelName="Locality"
            id="address.locality"
            name="address.locality"
            register={register}
            errors={errors}
          />
        </div>
        {/* Area */}
        <div className="col-span-2">
          <CommonInput
            labelName="Area"
            id="address.area"
            name="address.area"
            register={register}
            errors={errors}
          />
        </div>
        {/* City */}
        <div className="col-span-2">
          <CommonInput
            labelName="City"
            id="address.city"
            name="address.city"
            register={register}
            errors={errors}
          />
        </div>
        {/* Pincode */}
        <div className="col-span-2">
          <CommonInput
            labelName="Pincode"
            id="address.pincode"
            name="address.pincode"
            register={register}
            errors={errors}
            type="number"
          />
        </div>
        {/* Digipin */}
        <div className="col-span-2">
          <CommonInput
            labelName="Digipin"
            id="address.digipin"
            name="address.digipin"
            register={register}
            errors={errors}
          />
        </div>
        {/* state */}
        <div className="col-span-2">
          <AntSearchableSelector
            id="address.state"
            name="address.state"
            labelName="State"
            options={stateOptions}
            control={control}
            errors={errors}
          />
        </div>
        {/* country */}
        <div className="col-span-2">
          <AntSearchableSelector
            id="address.country"
            name="address.country"
            labelName="Country"
            options={countryOptions}
            control={control}
            errors={errors}
            disabled
          />
        </div>
      </div>
    </>
  );
};

export default AddressDetails;

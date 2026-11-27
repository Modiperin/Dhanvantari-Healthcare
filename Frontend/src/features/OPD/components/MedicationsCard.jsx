import { useState, useEffect, memo, useMemo, useCallback } from "react";
import SearchBox from "../../../components/Searchbox";
import useDebounce from "../../../hooks/useDebounce";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import CommonInput from "../../../components/CommonInput";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { cn } from "../../../lib/utils";
import { timeSlotOptions, timingOptions } from "../helper";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import PlusIcon from "../../../assets/svg/add-circle.svg?react";
import MinusIcon from "../../../assets/svg/minus.svg?react";
import TooltipWrapper from "../../../components/ReactTooltip";
import ButtonGroup from "../../../components/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  createMedication,
  getMedicationsList,
  resetApiState,
} from "../../../slices/consultationSlice";
import Skeleton from "../../../components/Skeleton";
import { useFieldArray, useFormContext } from "react-hook-form";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { pickKeys } from "../../../utils/common";

const MedicationsCard = () => {
  const { register, control, getValues, setValue, formState } =
    useFormContext();
  const medicationsMethods = useFieldArray({
    control,
    name: "medications",
  });
  const { errors } = formState;
  const { fields, append, remove, update } = medicationsMethods;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const dispatch = useDispatch();
  const { getMedicationsListApi, createMedicationApi } = useSelector(
    (state) => state.consultation
  );
  const { data, isLoading } = getMedicationsListApi;
  const { userInfo } = useSelector((state) => state.user);
  const hospitalId = userInfo?.response?.hospitalId;

  const medications = useMemo(() => {
    const oldMedications = data?.response || [];

    // Only add the "add new" option if we have a search term and results
    if (debouncedSearch.trim()) {
      return [
        ...oldMedications,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldMedications;
  }, [data, debouncedSearch]);

  const updateField = (index, field) => {
    const currentFieldValue = getValues("medications")[index];
    if (field.instruction === undefined) {
      update(index, {
        ...currentFieldValue,
        instruction: "",
      });
    } else {
      const { instruction: _, ...rest } = currentFieldValue; // Remove `instruction`
      update(index, rest); // Update without instruction
    }
  };

  const handleSelectMedicine = useCallback(
    (medication) => {
      if (medication.new) {
        addNew(medication.name);
      } else {
        append({
          _id: medication._id,
          name: medication.name,
          doses: 1,
          timeSlot: [],
          timing: "A",
          noOfDays: 1,
          totalQuantity: 0,
          instruction: undefined,
        });
      }
      setSearch("");
    },
    [append]
  );

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    medications,
    handleSelectMedicine
  );

  const addNew = useCallback(
    (medication) => {
      if (hospitalId && medication) {
        dispatch(createMedication({ data: { name: medication }, hospitalId }));
      }
    },
    [hospitalId]
  );

  // Render search results
  const renderMedicationsResults = useCallback(() => {
    if (isLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    } else {
      return medications.map((medication, i) => (
        <div
          key={medication._id}
          className={cn(
            "p-2 cursor-pointer hover:bg-gray-100 rounded-sm",
            i === cursor && "bg-blue-50"
          )}
          onClick={() => handleSelectMedicine(medication)}
          onMouseEnter={() => setCursor(i)}
        >
          <div className="font-medium">
            {medication.new && <span className="text-blue/50">Add new:</span>}
            {medication.name}
          </div>
        </div>
      ));
    }
  }, [medications, isLoading, cursor, setCursor, handleSelectMedicine]);

  // Register function for doses with quantity calculation
  const registerDoses = (index) => {
    const registration = register(`medications.${index}.doses`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = e?.target?.value ?? e;
        const days = getValues(`medications.${index}.noOfDays`) || 1;
        const slotCount =
          getValues(`medications.${index}.timeSlot`)?.length || 0;
        setValue(
          `medications.${index}.totalQuantity`,
          Number(value) * days * slotCount
        );
      },
    });

    return {
      ...registration,
      name: `medications.${index}.doses`,
      type: "number",
    };
  };

  // Register function for days with quantity calculation
  const registerDays = (index) => {
    const registration = register(`medications.${index}.noOfDays`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = e?.target?.value ?? e;
        const doses = getValues(`medications.${index}.doses`) || 1;
        const slotCount =
          getValues(`medications.${index}.timeSlot`)?.length || 0;
        setValue(
          `medications.${index}.totalQuantity`,
          doses * Number(value) * slotCount
        );
      },
    });

    return {
      ...registration,
      name: `medications.${index}.noOfDays`,
      type: "number",
    };
  };
  // Register function for timing Slot with quantity calculation
  const registerSlots = (index) => {
    const registration = register(`medications.${index}.timeSlot`, {
      onChange: () => {
        const slots = getValues(`medications.${index}.timeSlot`) || [];
        const slotCount = slots.length;
        const doses = getValues(`medications.${index}.doses`) || 1;
        const days = getValues(`medications.${index}.noOfDays`) || 1;
        setValue(
          `medications.${index}.totalQuantity`,
          doses * days * slotCount
        );
      },
    });

    return {
      ...registration,
      name: `medications.${index}.timeSlot`,
    };
  };

  useApiResponseHandler({
    status: createMedicationApi.status,
    data: createMedicationApi.data,
    error: createMedicationApi.error,
    sideAction: () =>
      handleSelectMedicine(
        pickKeys(createMedicationApi.data.response, ["_id", "name"])
      ),
    resetReduxStatus: () => dispatch(resetApiState("createMedicationApi")),
  });

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(getMedicationsList({ query: debouncedSearch.trim() }));
      setCursor(0);
    } else {
      dispatch(resetApiState("getMedicationsListApi"));
    }
  }, [debouncedSearch]);

  return (
    <div>
      <h2 className="title bg-[#00AC00]/10 block w-fit px-5 py-2 rounded-t-xl ml-5 my-0 !text-[16px] ">
        Medications
      </h2>
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              search.trim() &&
              medications.length === 0
            ) {
              e.preventDefault();
              addNew(search);
            } else {
              handleKeyDown(e);
            }
          }}
          showData={!!search.trim()}
          dataJSX={renderMedicationsResults()}
          placeholder="Search Patients"
        />

        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn("relative flex flex-col gap-3 w-full")}
          >
            <div className="grid grid-cols-4 lg:grid-cols-11 gap-5 items-center">
              <span className="text-blue text-sm block font-medium col-span-1 lg:col-span-3">
                {field.name}
              </span>
              <div className="col-span-1">
                <CommonInput
                  id={`medications.${index}.doses`}
                  labelName="Doses"
                  type="number"
                  register={registerDoses(index)}
                  errors={errors}
                />
              </div>
              <ButtonGroup
                id={`medications.${index}.timeSlot`}
                options={timeSlotOptions}
                register={registerSlots(index)}
                type="checkbox"
                errors={errors}
                _class="col-span-1 lg:col-span-2 scrollbar-hide"
                showLabel={false}
              />

              <div className="col-span-1 lg:col-span-2">
                <AntSearchableSelector
                  showSearch={false}
                  name={`medications.${index}.timing`}
                  control={control}
                  options={timingOptions}
                  labelName="Timing"
                  errors={errors}
                />
              </div>

              <div className="col-span-1">
                <CommonInput
                  id={`medications.${index}.noOfDays`}
                  register={registerDays(index)}
                  // name={`medications.${index}.noOfDays`}
                  labelName="Days"
                  type="number"
                  errors={errors}
                />
              </div>
              <div className="col-span-1">
                <CommonInput
                  disabled={true}
                  id={`medications.${index}.totalQuantity`}
                  name={`medications.${index}.totalQuantity`}
                  labelName="Quantity"
                  type="number"
                  register={register}
                  value={
                    (getValues(`medications.${index}.doses`) || 1) *
                    (getValues(`medications.${index}.noOfDays`) || 1) *
                    (getValues(`medications.${index}.timeSlot`)?.length || 0)
                  }
                  errors={errors}
                />
              </div>
              <div
                className="col-span-1 max-w-fit cursor-pointer min-w-6 h-6 flex gap-4 items-center justify-center"
                onClick={() => updateField(index, field)}
              >
                {field.instruction === undefined ? (
                  <TooltipWrapper
                    id={`medications.${index}.add-instruction`}
                    content="Add Instruction Field"
                    className="p-2 rounded-full hover:bg-blue-100 cursor-pointer"
                  >
                    <PlusIcon />
                  </TooltipWrapper>
                ) : (
                  <TooltipWrapper
                    id={`medications.${index}.remove-instruction`}
                    content="Remove Instruction Field"
                    className="p-2 rounded-full hover:bg-red-100 cursor-pointer"
                  >
                    <MinusIcon />
                  </TooltipWrapper>
                )}

                <TooltipWrapper
                  id={`medications.${index}.remove-medicine`}
                  content="Remove Medicine"
                  className="p-2 rounded-full hover:bg-red-100 cursor-pointer"
                >
                  <TrashIcon onClick={() => remove(index)} />
                </TooltipWrapper>
              </div>
            </div>
            {field.instruction !== undefined && (
              <CommonInput
                id={`medications.${index}.instruction`}
                name={`medications.${index}.instruction`}
                labelName="Instruction"
                type="text"
                register={register}
                errors={errors}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MedicationsCard);

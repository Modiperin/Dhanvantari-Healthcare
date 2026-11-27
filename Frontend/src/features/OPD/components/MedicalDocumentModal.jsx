import AntDatePicker from "../../../components/AntDatePicker";
import AntMultiSelector from "../../../components/AntDesign/AntMultiSelector";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import Modal from "../../../components/Modal";
import TooltipWrapper from "../../../components/ReactTooltip";
import PlusIcon from "../../../assets/svg/add-circle.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { cn } from "../../../lib/utils";
import FileUpload from "../../../components/FileUpload";
import SaveButton from "../../../components/Buttons/SaveButton";

const reportTypeOptions = [
  { label: "Blood Test Report", value: "bloodTest" },
  { label: "Urine Test Report", value: "urineTest" },
  { label: "X-Ray Report", value: "xRay" },
  { label: "MRI Scan Report", value: "mri" },
  { label: "CT Scan Report", value: "ctScan" },
  { label: "ECG Report", value: "ecg" },
  { label: "Ultrasound Report", value: "ultrasound" },
  { label: "Biopsy Report", value: "biopsy" },
  { label: "Pathology Report", value: "pathology" },
  { label: "Diabetes Panel", value: "diabetesPanel" },
  { label: "Thyroid Function Test", value: "thyroidTest" },
  { label: "Liver Function Test (LFT)", value: "liverTest" },
  { label: "Kidney Function Test (KFT)", value: "kidneyTest" },
  { label: "Lipid Profile", value: "lipidProfile" },
  { label: "COVID-19 Test Report", value: "covidTest" },
  { label: "Allergy Test Report", value: "allergyTest" },
  { label: "Genetic Test Report", value: "geneticTest" },
  { label: "Stool Test Report", value: "stoolTest" },
  { label: "Hormone Test Report", value: "hormoneTest" },
  { label: "Other", value: "other" },
];

const MedicalDocumentModal = ({ open = true, onClose }) => {
  const form = useForm({
    defaultValues: {
      reports: [
        {
          reportType: "",
          date: null,
          tags: [],
          files: null,
        },
      ],
    },
  });
  const { control, handleSubmit } = form;
  const reportMethods = useFieldArray({
    control,
    name: "reports",
  });
  const { fields, append, remove } = reportMethods;

  const onSubmit = (data) => {
    console.log("form data", data);
  };
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Medical Record(s)</span>}
      contentClassName="min-w-[90%] xl:min-w-[1000px] max-h-[85vh] min-h-[20vh] overflow-y-auto"
      className="bg-white rounded-md pb-4 flex flex-col gap-4"
      showClose
    >
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col items-end gap-2"
        >
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                "relative grid grid-cols-5 lg:grid-cols-9 gap-5 items-center w-full min-h-[65px] h-full"
              )}
            >
              <div className="col-span-2">
                <FileUpload name={`reports.${index}.files`} multiple={false} />
              </div>
              <div className="col-span-2">
                <AntMultiSelector
                  id={`reports.${index}.tags`}
                  name={`reports.${index}.tags`}
                  labelName="Tags"
                  options={[]}
                  control={control}
                  // errors={errors}
                  required
                />
              </div>
              <div className="col-span-2">
                <AntSearchableSelector
                  id={`reports.${index}.reportType`}
                  name={`reports.${index}.reportType`}
                  labelName="Report Type"
                  control={control}
                  // errors={errors}
                  options={reportTypeOptions}
                  required
                />
              </div>
              <div className="col-span-2">
                <AntDatePicker
                  id={`reports.${index}.date`}
                  name={`reports.${index}.date`}
                  label="Date"
                  control={control}
                  // errors={errors}
                  required
                />
              </div>

              <div className="col-span-1 max-w-fit cursor-pointer min-w-6 h-6 flex gap-4 items-center justify-center">
                <TooltipWrapper
                  id={`reports.${index}.add-medical-report`}
                  content="Add Medical Report"
                  className="p-2 rounded-full hover:bg-blue-100 cursor-pointer"
                >
                  <PlusIcon
                    onClick={() => {
                      append({
                        reportType: "",
                        date: null,
                        tags: [],
                        files: "",
                      });
                    }}
                  />
                </TooltipWrapper>

                {/* Remove button - Only show if more than one diagnosis */}
                {fields.length > 1 && (
                  <TooltipWrapper
                    id={`reports.${index}.remove-medical-report`}
                    content="Remove Medical Report"
                    className="p-2 rounded-full hover:bg-red-100 cursor-pointer"
                  >
                    <TrashIcon onClick={() => remove(index)} />
                  </TooltipWrapper>
                )}
              </div>
            </div>
          ))}
          <SaveButton type="submit" />
        </form>
      </FormProvider>
    </Modal>
  );
};

export default MedicalDocumentModal;

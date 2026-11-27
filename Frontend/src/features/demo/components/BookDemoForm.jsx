import FloatingInput from "../../../components/FloatingInput";
import SelectInput from "../../../components/SelectInput";

export default function BookDemoForm() {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
      <FloatingInput id="firstName" label="First Name" required />
      <FloatingInput id="lastName" label="Last Name" required />
      <FloatingInput id="email" label="Email ID" type="email" required />
      <FloatingInput id="phone" label="Phone Number" required />
      <FloatingInput id="website" label="Website URL" required />

      <SelectInput
        id="Branched"
        label="Branched"
        required
        options={[
          { label: "Single", value: "Single" },
          { label: "Multi-Branch", value: "multi" },
        ]}
      />
      <SelectInput
        id="hospitalType"
        label="Hospital Type"
        required
        options={[
          { label: "Physician", value: "physician" },
          { label: "General", value: "general" },
          { label: "Lab", value: "lab" },
          { label: "Radiology", value: "radiology" },
          { label: "Oncology", value: "oncology" },
        ]}
      />
      <div className="col-span-full flex flex-wrap gap-2">
        {[
          "Physician",
          "General",
          "Lab",
          "Radiology Center",
          "Oncology",
          "Urology",
        ].map((type) => (
          <label key={type} className="flex items-center gap-2">
            <input type="checkbox" name="hospitalType" value={type} />
            {type}
          </label>
        ))}
      </div>
      <button className="col-span-full mt-4 bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">
        Request for Free Demo →
      </button>
    </form>
  );
}

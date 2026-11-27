import { cn } from "../lib/utils";
import { getNestedError } from "../utils/common";

const ButtonGroup = ({
  name,
  labelName,
  options = [],
  selected = [],
  onChange = () => {},
  required = false,
  type = "radio",
  register,
  _class = "",
  errors = {},
}) => {
  const error = getNestedError(errors, name)?.message;
  const handleInputChange = (value) => {
    if (type === "checkbox") {
      const updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(updated);
    } else {
      const updated = selected.includes(value) ? [] : [value];
      onChange(updated);
    }
  };
  const isRegisterFunction = typeof register === "function";
  const isHookForm = !!register;

  const getInputProps = (opt) => {
    if (isHookForm && isRegisterFunction) {
      return register(name);
    } else if (isHookForm && !isRegisterFunction) {
      handleInputChange(opt.value);
      return register;
    } else {
      return {
        checked: selected.includes(opt.value),
        onChange: () => handleInputChange(opt.value),
      };
    }
  };

  return (
    <div className={cn("relative flex flex-col w-full z-0", _class)}>
      {labelName && (
        <label className="absolute-label !z-10 text-sm !-top-2 bg-white -mx-2 !text-blue">
          {labelName}
          {required && <span>*</span>}
        </label>
      )}

      <div className="flex w-fit rounded-lg flex-wrap overflow-x-hidden border border-light-blue">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="cursor-pointer border-r border-light-blue last:border-r-0"
          >
            <input
              type={type}
              name={name}
              value={opt.value}
              {...getInputProps(opt)}
              className="peer hidden"
            />
            <div
              className="h-10 w-8 lg:w-10 flex items-center justify-center text-blue
                peer-checked:bg-[#158BE2] peer-checked:text-white text-xs lg:text-sm select-none"
            >
              {opt.label}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default ButtonGroup;

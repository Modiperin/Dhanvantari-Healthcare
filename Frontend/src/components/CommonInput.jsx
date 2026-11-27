import { cn } from "../lib/utils";
import { getNestedError } from "../utils/common";

const CommonInput = ({
  id,
  name,
  value = "",
  labelName = "",
  type = "text",
  required = false,
  errors,
  register,
  disabled = false,
  onChange = () => {},
  extraClass = "",
  placeholder = " ",
  inputAsValue = false,
  title = "",
  ...rest
}) => {
  const isRegisterFunction = typeof register === "function";
  const isHookForm = !!register;

  let inputProps = {};

  switch (true) {
    case isHookForm && isRegisterFunction:
      // Case 1: Normal RHF register
      inputProps =
        type === "number"
          ? register(name, { valueAsNumber: true })
          : register(name);
      break;

    case isHookForm && !isRegisterFunction:
      // Case 2: Pre-registered object
      inputProps = register;
      break;

    default:
      // Case 3: Regular controlled input
      inputProps = {
        value: value ?? "",
        onChange: (e) => {
          const val =
            type === "number"
              ? e.target.value === ""
                ? null
                : Number(e.target.value)
              : e.target.value;
          onChange(val);
        },
      };
  }
  const errorMessage = getNestedError(errors, name || inputProps.name)?.message;

  return (
    <div className="relative w-full text-blue max-h-14 z-0 flex items-center">
      <p className="text-xs lg:text-sm text-nowrap text-light-blue-text">
        {title && title}
      </p>
      <div className="flex flex-col w-full">
        <input
          type={type}
          id={id}
          {...inputProps}
          {...rest}
          placeholder={!labelName ? placeholder : ""}
          disabled={disabled || inputAsValue}
          className={cn(
            !inputAsValue &&
              "border border-light-blue appearance-none focus:outline-none focus:ring-0 focus:border-blue hover:border-blue duration-300 rounded-lg",
            `h-10 text-xs lg:text-sm p-2 block w-full px-3 mt-0 bg-transparent`,
            extraClass
          )}
        />
        {!inputAsValue && labelName && (
          <label htmlFor={id} className="absolute-label text-xs lg:text-sm">
            {labelName}
            {required && <span>*</span>}
          </label>
        )}

        {errorMessage && (
          <p className="top-full text-[10px] lg:text-xs text-red-600 text-start text-nowrap">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommonInput;

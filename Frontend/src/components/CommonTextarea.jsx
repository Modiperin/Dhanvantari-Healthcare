import { cn } from "../lib/utils";
import { getNestedError } from "../utils/common";

const CommonTextarea = ({
  id,
  name,
  labelName = "",
  required = false,
  className = "",
  textareaClassName = "",
  errors,
  register = () => {},
  placeholder,
  children,
  onKeyDown = () => {},
  ...rest
}) => {
  const error = getNestedError(errors, name)?.message;
  return (
    <div className={cn(`relative w-full text-blue z-0`, className)}>
      <textarea
        placeholder={placeholder || " "}
        onKeyDown={onKeyDown}
        id={id}
        name={name}
        {...register(name, { required })}
        {...rest}
        required={required}
        className={cn(
          `p-2 block w-full px-2 mt-0 bg-transparent border border-light-blue appearance-none focus:outline-none focus:ring-0 focus:border-blue rounded-lg resize-none h-full`,
          textareaClassName
        )}
      />
      <label htmlFor={id} className="absolute-label">
        {labelName}
        {required && <span>*</span>}
      </label>
      {error && (
        <p className="w-full text-xs text-red-600 capitalize text-start">
          {error}
        </p>
      )}
      {children && children}
    </div>
  );
};

export default CommonTextarea;

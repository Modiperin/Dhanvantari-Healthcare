import { Select } from "antd";
import { Controller } from "react-hook-form";
import { getNestedError } from "../../utils/common";
import { cn } from "../../lib/utils";

const AntSearchableSelector = ({
  id,
  name,
  labelName: label = "",
  required = false,
  control,
  onChange: propOnChange = () => {},
  errors = {},
  disabled = false,
  placeholder = "Select an option",
  options = [],
  message,
  showSearch = true,
  isCompressed = false,
  defaultValue = null,
  filterSort = (optionA, optionB) =>
    (optionA?.label ?? "")
      .toLowerCase()
      .localeCompare((optionB?.label ?? "").toLowerCase()),
  ...rest
}) => {
  const error = getNestedError(errors, name)?.message;

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const commonClasses = `
    w-full 
    ant-multi-select 
    !capitalize
    !min-h-10
    [&_.ant-select-selector]:!min-h-10
    [&_.ant-select-selection-item]:!text-blue
    [&_.ant-select-arrow]:cursor-pointer 

    /* Normal state */
    [&_.ant-select-selector]:!border-light-blue
    [&_.ant-select-selector]:border
    
    /* Focus state */
    [&.ant-select-focused_.ant-select-selector]:!border-blue
    [&.ant-select-focused_.ant-select-selector]:!shadow-none
    [&.ant-select-focused_.ant-select-selector]:!outline-none
    
    /* Hover state */
    hover:[&_.ant-select-selector]:!border-blue
    
    /* Base styles */
    [&_.ant-select-selector]:rounded-lg
    [&_.ant-select-selector]:shadow-none
    focus:[&_.ant-select-selector]:shadow-none
  `;

  return (
    <div
      className={cn(
        "relative text-blue max-h-14",
        isCompressed ? "w-[10rem]" : "w-full"
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className="absolute-label !z-10 text-xs lg:text-sm !-top-2 bg-white mx-2 !text-blue"
        >
          {label}
          {required && <span>*</span>}
        </label>
      )}

      {control ? (
        // ✅ Controlled RHF mode using `control`
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id={id}
              showSearch={showSearch}
              placeholder={placeholder}
              disabled={disabled}
              optionFilterProp="children"
              filterOption={filterOption}
              filterSort={filterSort}
              options={options}
              onChange={(value, option) => {
                field.onChange(value); // updates RHF
                propOnChange?.(value, option); // for custom logic
              }}
              className={commonClasses}
              aria-label={label}
              virtual={false}
              getPopupContainer={(triggerNode) => triggerNode.parentNode} // Prevents portal issues
              {...rest}
              notFoundContent={
                !options.length
                  ? message || (
                      <p className="text-gray-400 text-xs lg:text-sm font-bold">
                        No options available.
                      </p>
                    )
                  : null
              }
            />
          )}
        />
      ) : (
        // ✅ Controlled standalone version (non-RHF)
        <Select
          id={id}
          showSearch={showSearch}
          placeholder={placeholder}
          disabled={disabled}
          optionFilterProp="children"
          filterOption={filterOption}
          filterSort={filterSort}
          defaultValue={defaultValue}
          options={options}
          onChange={(value, option) => {
            propOnChange?.(value, option);
          }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode} // Prevents portal issues
          className={commonClasses}
          aria-label={label}
          virtual={false}
          {...rest}
          notFoundContent={!options.length ? message : null}
        />
      )}

      {error && (
        <p className="text-[10px] lg:text-xs text-red-600 text-start ml-1 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default AntSearchableSelector;

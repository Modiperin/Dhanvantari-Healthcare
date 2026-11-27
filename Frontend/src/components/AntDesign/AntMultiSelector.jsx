import { useState } from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import { getNestedError } from "../../utils/common";

const AntMultiSelector = ({
  id,
  name,
  labelName: label = "Select",
  required = false,
  control,
  onChange: propOnChange = () => {},
  errors = {},
  disabled = false,
  placeholder = "Select options",
  options = [],
  defaultValue = [],
  showSearch = true,
  filterSort = (optionA, optionB) =>
    (optionA?.label ?? "")
      .toLowerCase()
      .localeCompare((optionB?.label ?? "").toLowerCase()),
  size = "middle",
  maxTagCount = "responsive",
  mode = "tags",
  ...rest
}) => {
  const error = getNestedError(errors, name)?.message;
  const [localValue, setLocalValue] = useState(defaultValue);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const commonClasses = `
    w-full 
    ant-multi-select 
    !min-h-10
    [&_.ant-select-selector]:!min-h-10
    [&_.ant-select-selection-item]:!text-blue
    [&_.ant-select-arrow]:cursor-pointer 
    [&_.ant-select-selection-wrap]:!m-2
    [&_.ant-select-selection-wrap]:!mb-0
    [&_.ant-select-selection-item]:!bg-light-blue
    
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
    <div className="relative w-full text-blue max-h-14">
      {label && (
        <label
          htmlFor={id}
          className="absolute-label !z-10 text-sm !-top-2 bg-white mx-2 !text-blue"
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
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select
              {...field}
              id={id}
              mode={mode}
              size={size}
              showSearch={showSearch}
              placeholder={placeholder}
              disabled={disabled}
              optionFilterProp="children"
              filterOption={filterOption}
              filterSort={filterSort}
              options={options}
              maxTagCount={maxTagCount}
              onChange={(value, option) => {
                field.onChange(value);
                propOnChange?.(value, option);
              }}
              className={commonClasses}
              aria-label={label}
              getPopupContainer={(triggerNode) => triggerNode.parentNode} // Prevents portal issues
              virtual={false}
              maxCount={5}
              {...rest}
            />
          )}
        />
      ) : (
        // ✅ Controlled standalone version (non-RHF)
        <Select
          id={id}
          mode="multiple"
          size={size}
          showSearch={showSearch}
          placeholder={placeholder}
          disabled={disabled}
          value={localValue}
          defaultValue={defaultValue}
          optionFilterProp="children"
          filterOption={filterOption}
          filterSort={filterSort}
          options={options}
          maxTagCount={maxTagCount}
          onChange={(value, option) => {
            setLocalValue(value);
            propOnChange?.(value, option);
          }}
          className={commonClasses}
          aria-label={label}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          virtual={false}
          maxCount={5}
          {...rest}
        />
      )}

      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default AntMultiSelector;

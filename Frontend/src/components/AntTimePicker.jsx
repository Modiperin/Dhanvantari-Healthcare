import { TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import TimerIcon from "../assets/svg/clock.svg?react"

export const AntTimePicker = ({
  id,
  name,
  label = "Time",
  required = false,
  control,
  onChange: propOnChange = () => {},
  errors = {},
  disabled = false,
  placeholder = "HH:MM A",
  format="HH:MM A"
}) => {
  const error = errors?.[name];
  const [localValue, setLocalValue] = useState(null);

  const validationRules = {
    required: required ? `${label} is required` : false,
  };
  return (
    <div className="relative w-full text-blue z-0">
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
        // ✅ controlled RHF mode using `control `
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => (
            <TimePicker
              {...field}
              id={id}
              allowClear
              disabled={disabled}
              format={format}
              placeholder={placeholder}
              inputReadOnly={false}
              value={field.value ? dayjs(field.value, format) : null}
              onChange={(date, dateString) => {
                field.onChange(dateString); // updates RHF
                propOnChange?.(date, dateString); // for custom logic like setting age
              }}
              className="peer
            !border !border-light-blue !h-12 w-full
            [&_.ant-picker-input>input]:!h-12
            [&_.ant-picker-input>input]:!text-blue
            [&_.ant-picker-suffix]:cursor-pointer
          "
              suffixIcon={
                <span className="ant-picker-suffix cursor-pointer">
                  <TimerIcon className="w-4 h-4" />
                </span>
              }
            />
          )}
        />
      ) : (
        // ✅ Controlled standalone version (non-RHF)
        <TimePicker
          id={id}
          format={format}
          allowClear
          disabled={disabled}
          placeholder={placeholder}
          inputReadOnly={false}
          value={localValue ? dayjs(localValue, format) : null}
          onChange={(date, dateString) => {
            setLocalValue(dateString);
            propOnChange(date, dateString);
          }}
          className="peer
            !border !border-light-blue !h-12 w-full
            [&_.ant-picker-input>input]:!h-12
            [&_.ant-picker-input>input]:!text-blue
            [&_.ant-picker-suffix]:cursor-pointer
          "
          suffixIcon={
            <span className="ant-picker-suffix cursor-pointer">
              <TimerIcon className="w-4 h-4" />
            </span>
          }
        />
      )}

      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

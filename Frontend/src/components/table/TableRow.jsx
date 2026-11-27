import React, { useState } from "react";
import { currency, HeaderType, prioriry } from "../../utils/types";
import { cn } from "../../lib/utils";
import Tooltip from "../Tooltip";
import LongDesc from "../LongDesc";
import CheckBox from "../Checkbox";
import FlagIcon from "../svgs/FlagIcon";
import ActionButton from "../../assets/svg/actionButton.svg?react";
import IconText from "../IconText";
import ActionDropdown from "../ActionDropdown";
import IconButton from "../IconButton";
import Badge from "../Budge";
import Button from "../Buttons/Button";

const TableRow = ({ data, columns, isCompressView, handleChecked }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      <div
        key={data?._id}
        className={cn(
          isCompressView ? "p-0" : "p-2 xl:p-4",
          "grid grid-cols-12 items-center text-xs xl:text-sm hover:bg-extra-light-blue/50 transition"
        )}
      >
        {columns.map((col) => {
          const { value, _class = "col-span-1", type, actions } = col;
          const commonProps = {
            className: cn(
              _class,
              "px-2 py-2 text-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide text-blue"
            ),
          };

          switch (type) {
            case HeaderType.statusBudge:
              return (
                <Badge
                  key={value}
                  type={data?.[value] ? "active" : "inactive"}
                  className={_class}
                />
              );

            case HeaderType.roleBudge:
              return (
                <Badge
                  key={value}
                  type="role"
                  title={data?.[value]}
                  className={_class}
                />
              );

            case HeaderType.tooltip:
              return (
                <Tooltip key={value} _class={_class} data={data?.[value]} />
              );

            case HeaderType.longDesc:
              return (
                <LongDesc key={value} str={data?.[value]} _class={_class} />
              );

            case HeaderType.currencyType:
              return (
                <div
                  key={value}
                  className={cn(_class, "px-2 py-2 text-nowrap text-blue")}
                >
                  {data?.[value]}
                  {currency[data?.currencyType]}
                </div>
              );

            case HeaderType.checkbox:
              return (
                <CheckBox
                  key={value}
                  _class={_class}
                  checked={data?.[value]}
                  handleChecked={() => handleChecked(data?._id)}
                />
              );
            case HeaderType.flag:
              return (
                <div {...commonProps} key={value}>
                  {data?.[value] === prioriry.emergency ? (
                    <FlagIcon color="#FF0000" />
                  ) : data?.[value] === prioriry.vip ? (
                    <FlagIcon color="#d4af37" />
                  ) : (
                    <FlagIcon />
                  )}
                </div>
              );
            case HeaderType.iconText:
              return (
                <IconText key={value} text={data?.[value]} _class={_class} />
              );

            case HeaderType.colorBudge:
              return (
                <Badge key={value} type={data?.[value]} className={_class} />
              );
            case HeaderType.paymode: {
              const rawPayModes = data?.[value] || "";
              const counts = rawPayModes
                ?.split(",")
                ?.map((item) => item.trim().toLowerCase()) // normalize once
                ?.reduce((acc, key) => {
                  if (key != "") acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {});
              return (
                <div
                  className={cn("flex flex-wrap gap-0.5", _class)}
                  key={value}
                >
                  {Object.entries(counts).map(([key, count]) => (
                    <Badge
                      key={key}
                      type={key}
                      title={`${key.toUpperCase()} (${count})`}
                      className="mr-1"
                      dot={false}
                    />
                  ))}
                </div>
              );
            }
            case HeaderType.dynamicAction:
              return (
                <div key={value} className="flex items-center gap-3">
                  {actions.map((action) => {
                    return (
                      <div
                        disabled={action.disabled}
                        className={cn(
                          _class,
                          "flex items-center cursor-pointer whitespace-nowrap scrollbar-hide disabled:cursor-not-allowed"
                        )}
                        key={action.label}
                        onClick={() => action.onClick(data)}
                      >
                        {action.icon}
                      </div>
                    );
                  })}
                </div>
              );

            case HeaderType.actionWithSubMenu: {
              const rowActions = col?.options?.map((action) => ({
                ...action,
                onClick: () => action.onClick(data), // inject current row (data)
              }));
              return (
                <div className="flex items-center gap-2" key={value}>
                  <ActionDropdown
                    actions={rowActions}
                    open={dropdownOpen}
                    onOpenChange={setDropdownOpen}
                  >
                    <Button
                      variant="light"
                      className="rounded-full focus:ring-0 hover:border-light-blue duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen((open) => !open);
                      }}
                    >
                      <span className="hidden xl:flex ">
                        {" "}
                        <ActionButton className="h-4 w-4 mr-1" />
                      </span>
                      Actions
                    </Button>
                  </ActionDropdown>
                </div>
              );
            }

            default:
              return (
                <div {...commonProps} key={value}>
                  {data?.[value]}
                </div>
              );
          }
        })}
      </div>
    </>
  );
};

export default TableRow;

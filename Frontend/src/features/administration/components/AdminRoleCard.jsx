import React from "react";

const AdminRoleCard = ({ modules, moduleNameMaps }) => {
  return (
    <div className="bg-blue-50 text-blue border border-light-blue rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-blue font-medium text-lg">
          Administrator - Full Module Access
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <div
            key={moduleNameMaps[module].name}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col gap-2"
          >
            <h3 className="text-lg">{moduleNameMaps[module].name}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {moduleNameMaps[module].desc}
            </p>
            <div className="flex gap-2">
              <span className="bg-blue-100  px-3 py-1 rounded-full text-xs font-medium">
                {"Preview"}
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                {"Modify(Create,Update,Delete)"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoleCard;

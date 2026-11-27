import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { EmptyData } from "../EmptyData";

const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const PieChartComponent = ({ data }) => {
  if (!data.length) {
    return <EmptyData from="dashboardChart" />;
  }

  return (
    <ResponsiveContainer width={300} height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={100}
          label={renderLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    // <div className="bg-white rounded-2xl p-6 shadow-sm border">
    //   <h2 className="text-xl font-semibold mb-4 text-[#0b3558]">
    //     Most Common Diagnoses
    //   </h2>
    //   <div className="flex items-center justify-between flex-wrap">
    //     {/* Donut Chart */}

    //     {/* Legend */}
    //     <div className="space-y-3">
    //       {data.map((item, idx) => (
    //         <div key={idx} className="flex items-center gap-2">
    //           <span
    //             className="w-3 h-3 rounded-full"
    //             style={{ backgroundColor: item.color }}
    //           />
    //           <span className="text-[#0b3558] font-medium">{item.name}</span>
    //           <span className="ml-auto text-[#0b3558] font-semibold">
    //             {item.value}%
    //           </span>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Download Button */}
    //   <button className="mt-6 flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
    //     <Download size={16} />
    //     Download Report
    //   </button>
    // </div>
  );
};
export default PieChartComponent;

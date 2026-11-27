import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const LineChart = ({
  data,
  XAxisDataKey,
  AreaDataKey,
  formatter,
  tickFormatter,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#81C5F8" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#81C5F8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={XAxisDataKey}
          axisLine={false}
          stroke="#0f3e69"
          tick={{ fontSize: 12 }}
          padding={{ left: 30, bottom: 10, right: 30 }}
        />
        <YAxis
          stroke="#0f3e69"
          domain={[0, 100]}
          axisLine={false}
          tickFormatter={tickFormatter}
          tick={{ fontSize: 12 }}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip
          formatter={formatter}
          labelClassName="text-blue"
          contentStyle={{
            fontSize: 12,
            borderColor: "#e1effd",
            borderRadius: "8px",
            border: "1px solid #81C5F8",
          }}
        />
        <Area
          type="monotone"
          dataKey={AreaDataKey}
          stroke="#81C5F8"
          fill="url(#tempGradient)"
          strokeWidth={1}
          dot={{ stroke: "#81C5F8", strokeWidth: 2, fill: "#fff", r: 4 }}
          activeDot={{ r: 7 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineChart;

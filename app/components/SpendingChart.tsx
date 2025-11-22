"use client";
import { Cell, Pie, PieChart, PieLabelRenderProps, Legend } from "recharts";

// #region Sample data
const data = [
  { name: "Bills", value: 150 },
  { name: "Groceries", value: 50 },
  { name: "Dining Out", value: 100 },
  { name: "Subscriptions", value: 75 },
  { name: "Travel", value: 125 },
];

// #endregion
const RADIAN = Math.PI / 180;
const COLORS = [
  "#c90a23ea",
  "#0b8fc8ea",
  "#c88f14ea",
  "#db5411ea",
  "#049537ea",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SpendingChart({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "30vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Legend />
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        stroke="#0b181c"
        strokeWidth={5}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
}

"use client";
import { Cell, Pie, PieChart, PieLabelRenderProps, Legend } from "recharts";
import { useDashboard } from "../hooks/useDashboard";

// // #region Sample data
// const data = [
//   { name: "Subscriptions", value: 150 },
//   { name: "Bills", value: 50 },
//   { name: "Loans", value: 100 },
//   { name: "Insurance", value: 75 },
//   { name: "Tax", value: 125 },
//   { name: "Other", value: 125 },
// ];

// #endregion
const RADIAN = Math.PI / 180;
const COLORS = [
  "#c90a23ea",
  "#0b8fc8ea",
  "#c88f14ea",
  "#db5411ea",
  "#049537ea",
  "#4b494dea",
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
  pieData,
  isAnimationActive = true,
}: {
  pieData: { name: string; value: number }[];
  isAnimationActive?: boolean;
}) {
  //console.log(pieData);
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
        data={pieData}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        stroke="#0b181c"
        strokeWidth={5}
      >
        {pieData.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
}

"use client";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

// #region Sample data
const data = [
  { name: "Jan", Spending: 1000 },
  { name: "Feb", Spending: 400 },
  { name: "Mar", Spending: 1200 },
  { name: "Apr", Spending: 700 },
  { name: "May", Spending: 200 },
  { name: "Jun", Spending: 400 },
  { name: "Jul", Spending: 1220 },
  { name: "Aug", Spending: 620 },
  { name: "Sept", Spending: 400 },
  { name: "Oct", Spending: 900 },
  { name: "Nov", Spending: 100 },
  { name: "Dec", Spending: 0 },
];

// #endregion
const MonthlySpendingChart = () => {
  return (
    <section className="flex flex-col w-full mr-4">
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "100px", // sets the height
          aspectRatio: 1.618,
        }}
        responsive
        data={data} // tells rechart what to read
        // size is controlled by css
        // uv - the column that defines bar height
      >
        <Bar
          dataKey="Spending"
          fill="#ed960a"
          name={"Monthly Spending"}
          barSize={15}
        />
        <XAxis dataKey="name" />
        <YAxis />
      </BarChart>
      <p className="text-(--text-light) text-center">Spendings by month</p>
    </section>
  );
};

export default MonthlySpendingChart;

"use client";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import type { MonthlySpending } from "@/lib/types/dashboard";

interface Props {
  data: MonthlySpending[] | [];
}

const MonthlySpendingChart = ({ data }: Props) => {
  return (
    <section className="flex flex-col w-full mr-4">
      <BarChart
        style={{
          width: "100%",
          maxWidth: "",
          maxHeight: "200px", // sets the height
          aspectRatio: 1.618,
          pointerEvents: "none",
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
          activeBar={false}
        />
        <XAxis dataKey="name" />
        <YAxis />
      </BarChart>
    </section>
  );
};

export default MonthlySpendingChart;

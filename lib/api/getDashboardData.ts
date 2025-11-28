// fetches the data (for now just from the dummy data file "public/data/dashboardData.ts")

// get the type for the dashboard data
import { DashboardData } from "../types/dashboard";
import axios from "axios";
export async function getDashboardData(): Promise<DashboardData> {
  try {
    //console.log("fetching dashboard data");
    // const res = await axios.get<DashboardData>("./data/dashboardData.json");
    const res = await axios.get<DashboardData>(
      "http://localhost:4000/api/dashboard"
    );
    // console.log(res.data);
    return res.data;
    // this works because axios automatically parses JSON
  } catch (error) {
    // console.log("Error while fetching data ", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.statusText || "Failed to fetch dashboard data"
      );
    } else {
      throw new Error("Failed to fetch dashboard data.");
    }
  }
}

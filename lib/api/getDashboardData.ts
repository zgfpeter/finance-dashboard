// fetches the data (for now just from the dummy data file "public/data/dashboardData.ts")

// get the type for the dashboard data
import { DashboardData } from "../types/dashboard";
import axios from "axios";
export async function getDashboardData(token: string): Promise<DashboardData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    //console.log("fetching dashboard data");
    // const res = await axios.get<DashboardData>("./data/dashboardData.json");
    const res = await axios.get<DashboardData>(`${apiUrl}/dashboard`, {
      // add the authorization header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.data) {
      throw new Error("Dashboard data is empty.");
    }
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

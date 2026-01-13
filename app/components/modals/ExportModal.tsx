"use client";
import { useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { MdDownload } from "react-icons/md";
import LoadingSpinner from "../ui/LoadingSpinner";

type Entity = "transactions" | "upcomingCharges" | "debts" | "goals";

export default function ExportModal({ entity }: { entity: Entity }) {
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Important: responseType 'blob' is required for file downloads
      const response = await axiosAuth.get(`/export/${entity}`, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set filename (e.g., transactions_2024-01-01.csv)
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `${entity}_${dateStr}.csv`);

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 text-sm underline hover:text-cyan-600 underline-offset-4 disabled:opacity-50"
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          <MdDownload className="text-lg" />
          Export {entity} / Download Template
        </>
      )}
    </button>
  );
}

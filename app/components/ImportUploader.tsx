"use client";

import { useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import { MdUpload } from "react-icons/md";

type Entity = "transactions" | "upcomingCharges" | "debts" | "goals";
type Mode = "append" | "replace" | "upsert";

interface Props {
  entity: Entity;
  onSuccess?: () => void;
}

export default function ImportUploader({ entity, onSuccess }: Props) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("append");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axiosAuth.post(`/import/${entity}?mode=${mode}`, formData);

      setSuccess(true);
      setFile(null);

      // refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Import failed. Check CSV format.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-(--secondary-blue) p-2 rounded-md flex flex-col gap-3">
      <h3 className="font-semibold capitalize pl-3">
        Import {entity.replace(/([A-Z])/g, " $1")}
      </h3>

      {/* Mode selector */}
      <div className="flex border-(--secondary-blue) flex-col p-3 gap-3 md:grid md:grid-cols-[auto_1fr_auto] md:items-center w-full">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="border border-(--secondary-blue) px-2 rounded-md h-11 w-fit"
        >
          <option value="append">Append (safe)</option>
          <option value="upsert">Upsert (update or insert)</option>
          <option value="replace">Replace (dangerous)</option>
        </select>

        {/* File input */}
        <input
          type="file"
          accept=".csv"
          className="border border-(--secondary-blue) rounded-md h-11 file:h-full file:border-0 file:bg-transparent file:p-3 file:text-sm w-fit"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="border border-emerald-800 px-2 rounded-md h-11  disabled:opacity-50 w-25 flex items-center justify-between"
        >
          {loading ? "Uploading..." : "Upload"}
          <MdUpload />
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">Import successful!</p>
        )}
      </div>
    </div>
  );
}

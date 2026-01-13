"use client";

import { useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import { MdUpload } from "react-icons/md";
import { AxiosError } from "axios";
import { Entity } from "@/lib/types/dashboard";
type Mode = "append" | "replace" | "upsert";

interface Props {
  entity: Entity;
  onSuccess?: () => void;
}

interface ImportError {
  row: number;
  message: string;
}

export default function ImportUploader({ entity, onSuccess }: Props) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("append");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [validationErrors, setValidationErrors] = useState<ImportError[]>([]);

  async function handleUpload() {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    setValidationErrors([]); // clear previous

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // my useAxiosAuth hook has a default header setting Content-Type: application/json. But for files, i need to allow multipart/form-data
      await axiosAuth.post(`/import/${entity}?mode=${mode}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setFile(null);

      // refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.errors) {
          setValidationErrors(err.response.data.errors);
          setError("Validation failed. See details below.");
        } else {
          const msg = err.response?.data?.message || "Import failed.";
          setError(msg);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" border-(--secondary-blue) p-2 rounded-md flex flex-col gap-3">
      <h3 className="pl-3 font-semibold capitalize">
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
          className="border border-(--secondary-blue) rounded-md h-11 file:h-full file:border-0 file:bg-transparent file:p-3 file:text-sm w-fit hover:border-cyan-600"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="flex items-center justify-between px-2 border rounded-md hover:border-cyan-600 h-11 disabled:opacity-50 w-25 "
        >
          {loading ? "Uploading..." : "Upload"}
          <MdUpload />
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <p className="text-sm text-green-500">Import successful!</p>
        )}
      </div>
      {validationErrors.length > 0 && (
        <div className="p-2 mt-2 overflow-y-auto text-sm border border-red-200 rounded bg-red-50 max-h-32">
          <p className="mb-1 font-bold text-red-600">Row Errors:</p>
          <ul className="pl-4 text-red-600 list-disc">
            {validationErrors.map((error, index) => (
              <li key={index}>
                Row {error.row}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

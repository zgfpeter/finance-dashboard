"use client";
import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import SeparatorLine from "../ui/SeparatorLine";
import { MdCheck } from "react-icons/md";

interface Props {
  onClose: () => void;
}

// Proper enum for contact reasons (exported for reuse if desired)
export enum ContactReason {
  Technical = "Technical",
  Suggestion = "Suggestion",
  Billing = "Billing",
  Other = "Other",
}

// Shape of the form state
interface ContactForm {
  reason: ContactReason;
  title: string;
  body: string;
  email?: string; // optional so you can contact back
}

export default function ContactModal({ onClose }: Props) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  // initial form state
  const [data, setData] = useState<ContactForm>({
    reason: ContactReason.Technical,
    title: "",
    body: "",
    email: "",
  });

  // object of errors keyed by field name
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    reason: "",
    title: "",
    body: "",
    email: "",
    general: "",
  });

  // success indicator
  const [success, setSuccess] = useState(false);

  // Generic onChange handler that works for <input>, <textarea>, <select>
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value } as ContactForm));

    // clear an error for the field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // simple validation logic
  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!data.title.trim()) newErrors.title = "Title is required.";
    if (!data.body.trim()) newErrors.body = "Message body is required.";

    // optional email validation if provided
    if (data.email && data.email.trim()) {
      // very small email regex (okay for client-side only)
      const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRe.test(data.email.trim()))
        newErrors.email = "Enter a valid email.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // mutation to send the contact payload to the backend
  const contactMutation = useMutation({
    mutationFn: (payload: ContactForm) => axiosAuth.post(`/contact`, payload),
    onSuccess: () => {
      // small optimistic UI: mark success, reset form and optionally invalidate queries
      setSuccess(true);
      setData({
        reason: ContactReason.Technical,
        title: "",
        body: "",
        email: "",
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] }); // optional: in case contact affects server-side state you care about

      // close modal after a short delay so user sees success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    },
    onError: (err) => {
      // show a generic error — you can expand this to show server-provided messages
      setErrors({ general: "Failed to send message. Please try again later." });
      console.error("contact error", err);
    },
  });

  // derived flags
  const isPending = contactMutation.isPending;
  const isError = contactMutation.isError;

  // handle submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    // send the payload
    contactMutation.mutate(data);
  }

  return (
    <div
      className="relative flex flex-col items-center h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute text-xl text-red-500 right-10 top-4"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 id="modal-title" className="text-xl font-semibold">
        Get in touch
      </h2>

      {/* general error area */}
      {errors.general && <ErrorState message={errors.general} />}

      <form
        className="relative flex flex-col items-center w-full max-w-xl justify-evenly"
        id="contactForm"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full">
          {/* Reason dropdown */}
          <div className="flex flex-col gap-1 p-1">
            <label htmlFor="reason">Reason</label>
            <select
              id="reason"
              name="reason"
              value={data.reason}
              onChange={handleChange}
              className="border border-(--secondary-blue) rounded-md p-2 h-11"
            >
              {/* map enum to options */}
              {Object.values(ContactReason).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1 p-1">
            <label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={handleChange}
              name="title"
              id="title"
              maxLength={120}
              required={true}
              className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Email) */}
          <div className="flex flex-col gap-1 p-1">
            <label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={handleChange}
              name="email"
              id="email"
              required={true}
              placeholder="yourEmail@example.com"
              className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 h-11"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1 p-1">
            <label htmlFor="body">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              value={data.body}
              onChange={handleChange}
              rows={3}
              required={true}
              maxLength={2000}
              className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500"
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-500">{errors.body}</p>
            )}
          </div>
        </div>
      </form>
      <SeparatorLine width="3/4" />

      <button
        type="submit"
        form="contactForm"
        className="relative border rounded-md px-6 py-3 min-w-[180px] grid place-items-center hover:border-teal-500 disabled:opacity-70"
        aria-label="Send message"
        disabled={isPending}
      >
        <span
          className={`transition-opacity ${
            isPending ? "opacity-0" : "opacity-100"
          }`}
        >
          Send
        </span>

        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {success && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 text-white rounded-md bg-emerald-900">
            Sent <MdCheck />
          </div>
        )}
      </button>

      {/* server error block: if mutation failed show a simple message */}
      {isError && !errors.general && (
        <div className="mt-3 text-red-500">
          An error occurred sending the message.
        </div>
      )}
    </div>
  );
}

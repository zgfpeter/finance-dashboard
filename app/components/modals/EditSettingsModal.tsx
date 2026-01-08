"use client";

import { useUpdateUserDetails } from "@/app/hooks/useUpdateUser";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
import { UserSettings } from "@/lib/types/User";
import { FormEvent, useEffect, useState } from "react";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import Image from "next/image";
import { MdCheck, MdClose } from "react-icons/md";
import { useSession } from "next-auth/react";

interface Props {
  data: UserSettings | null;
  onClose: () => void;
}

export default function EditSettingsModal({ data, onClose }: Props) {
  const { data: session, update: updateSession } = useSession();

  const updateUserMutation = useUpdateUserDetails();

  const [currency, setCurrency] = useState<CurrencyCode>(
    data?.currency || "EUR"
  );
  const [username, setUsername] = useState(
    data?.username || "default username"
  );

  // avatar url that will be sent to backend
  const [avatar, setAvatar] = useState(data?.avatarUrl ?? "");

  // temp avatar url for preview
  const [tempAvatarUrl, setTempAvatarUrl] = useState(
    data?.avatarUrl || "/userProfile.jpg"
  );

  const [imageLoading, setImageLoading] = useState(true);

  // keep avatar in sync with preview input url
  const handleSave = () => {
    updateUserMutation.mutate(
      {
        username,
        currency,
        avatar,
      },
      {
        onSuccess: async (res) => {
          // update the session after user changed their settings
          // these are the settings the user can change, username, currency and avatar url
          await updateSession({
            username: res.user.username,
            currency: res.user.currency,
            avatarUrl: res.user.avatar,
          });

          onClose();
        },
      }
    );
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSave();
    // TODO validate and call handle save
    console.log("Submitting user settings changes");
  }
  const { isPending, isError, error } = updateUserMutation;
  if (!data) return <ErrorState message="No data" />;
  return (
    <section
      className="h-full flex items-center flex-col justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute right-10 top-4 text-red-500 text-xl"
        aria-label="Close modal"
        type="button"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold">Editing settings</h2>

      <form
        className="flex flex-col items-center w-full max-w-xl justify-evenly gap-5 relative"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col justify-between ">
          <div>
            <div className="relative h-20 w-20 md:w-40 md:h-40 justify-self-center my-3">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center border border-(--primary-orange) rounded-md bg-black/10 z-10">
                  <LoadingSpinner size="sm" />
                </div>
              )}

              {/* {changeAvatar && (
                <button className=" bg-(--primary-blue)/80 border border-(--primary-orange) h-full  w-full rounded-md absolute">
                  Change
                </button>
              )} */}
              <Image
                // key={tempAvatarUrl} // forces Next.js to reload the image when URL changes
                src={tempAvatarUrl}
                alt="user profile photo"
                fill
                className="border border-(--primary-orange) rounded-full object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setTempAvatarUrl("/userProfile.jpg"); // fallback if URL fails
                  setImageLoading(false);
                }}
              />
            </div>

            <div>
              <div className="flex flex-col gap-3 m-3">
                <label htmlFor="avatar">Avatar Url</label>
                {/* error if the form validation fails */}
                {/* {errors.avatar && (
                  <span className="text-red-500 absolute right-5">
                    {errors.avatar}
                  </span>
                )} */}
                <input
                  type="text"
                  value={tempAvatarUrl}
                  onChange={(e) => {
                    setTempAvatarUrl(e.target.value);
                    setImageLoading(true); // start spinner for new URL
                  }}
                  name="avatar"
                  placeholder="https://"
                  id="avatar"
                  className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 md:w-full"
                />
              </div>

              <div className="flex flex-col gap-3 m-3">
                <label htmlFor="username">New username</label>
                {/* error if the form validation fails */}
                {/* {errors.username && (
                  <span className="text-red-500 absolute right-5">
                    {errors.username}
                  </span>
                )} */}
                <input
                  type="text"
                  value={username}
                  required
                  maxLength={40}
                  onChange={(e) => setUsername(e.target.value)}
                  name="username"
                  id="username"
                  className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 md:w-full"
                />
              </div>

              <div className="flex flex-col gap-3 m-3">
                <label htmlFor="currencies">Currency</label>
                {/* {errors.type && (
                  <span className="text-red-500">{errors.type}</span>
                )} */}
                <select
                  id="currencies"
                  value={currency}
                  // TODO send user preferences ( settings ) to backend
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  name="currencies"
                  required
                  className="border border-(--secondary-blue) rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500 w-fit"
                >
                  {Object.entries(currencies).map(([code, data]) => (
                    <option key={code} value={code}>
                      {data.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {(error as Error).message}
            </p>
          )}

          <div className="flex justify-evenly items-center self-center p-3 w-full">
            <button
              type="button"
              className="hover:text-red-600 flex items-center justify-center border-red-500 border-l border-r w-10 rounded-full h-10"
              aria-label="Cancel changes"
              onClick={onClose}
            >
              <MdClose size={20} />
            </button>

            <button
              type="submit"
              className="hover:text-emerald-600 flex items-center justify-center border-l border-r border-emerald-600 w-10 rounded-full h-10"
              aria-label="Save changes"
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner /> : <MdCheck size={20} />}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

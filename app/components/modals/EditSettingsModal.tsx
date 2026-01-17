"use client";

import { useUpdateUserDetails } from "@/app/hooks/useUpdateUser";
import { currencies, CurrencyCode } from "@/lib/types/dashboard";
import { UserSettings } from "@/lib/types/User";
import { FormEvent, useState } from "react";
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
      className="flex flex-col items-center h-full justify-evenly"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        onClick={onClose}
        className="absolute text-xl text-red-500 right-5 top-3"
        aria-label="Close modal"
        type="button"
      >
        ✕
      </button>

      <h2 className="py-2 text-xl font-semibold">Editing settings</h2>

      <form
        className="relative flex flex-col items-center w-full max-w-xl py-5 justify-evenly"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full ">
          <div>
            <div className="relative w-20 h-20 my-3 md:w-40 md:h-40 justify-self-center">
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
                <label htmlFor="avatar">Avatar url</label>
                {/* error if the form validation fails */}
                {/* {errors.avatar && (
                  <span className="absolute text-red-500 right-5">
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
                  <span className="absolute text-red-500 right-5">
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
            <p className="mt-2 text-sm text-center text-red-500">
              {(error as Error).message}
            </p>
          )}

          <div className="flex items-center self-center w-full p-3 justify-evenly">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border-l border-r border-red-500 rounded-full hover:text-red-600"
              aria-label="Cancel changes"
              onClick={onClose}
            >
              <MdClose size={20} />
            </button>

            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 border-l border-r rounded-full hover:text-emerald-600 border-emerald-600"
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

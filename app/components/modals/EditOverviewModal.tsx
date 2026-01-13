import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { currencies, EditOverview } from "@/lib/types/dashboard";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MdClose, MdCheck, MdAdd, MdDelete } from "react-icons/md";
import {
  AccountType,
  DashboardData,
  CurrencyCode,
} from "@/lib/types/dashboard";
import { formatCurrency } from "@/lib/utils";
import { filterGraphicalNotStackedItems } from "recharts/types/state/selectors/axisSelectors";
import SeparatorLine from "../ui/SeparatorLine";
import ErrorState from "../ui/ErrorState";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useSession } from "next-auth/react";

interface Props {
  data: EditOverview | null;
  onClose: () => void;
}

interface EditableAccount {
  type: AccountType | "";
  balance: string; // string because number defaults to 0, then when typing becomes 0123..., can't delete the 0 easily.
  isNew?: boolean;
}

export interface UpdateOverviewPayload {
  totalBalance: number;
  accounts: {
    type: AccountType;
    balance: number;
  }[];
}
function isEmptyString(value: string) {
  return value.trim() === "";
}

export default function EditOverviewModal({ data, onClose }: Props) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const currency = session?.user?.currency; // get currency
  const currencySymbol = currencies[currency as CurrencyCode]?.symbol;

  const [totalBalance, setTotalBalance] = useState<string>(
    data ? data.totalBalance.toString() : ""
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    totalBalance: "",
    newAccount: "",
    atLeastOne: "",
    generalError: "",
  });

  const [accountsState, setAccountsState] = useState<EditableAccount[]>(
    data?.accounts?.map((a) => ({
      type: a.type,
      balance: a.balance.toString(),
      isNew: false,
    })) || []
  );

  // at most the user can have 4 accounts ( one of each type, there are 4 types)
  const MAX_ACCOUNTS = 4;

  // add a new account if they have less than 4
  function addAccount() {
    if (accountsState.length >= MAX_ACCOUNTS) return;
    setAccountsState((prev) => [
      ...prev,
      { type: "", balance: "", isNew: true },
    ]);
  }

  function removeAccount(index: number) {
    setAccountsState((prev) => prev.filter((_, i) => i !== index));
  }

  // types of accounts the user can have
  const allAccountTypes: AccountType[] = [
    "checking",
    "savings",
    "credit",
    "cash",
  ];

  // when the user selects one, it becomes unavailable and cannot be selected again
  function getAvailableAccountTypes(index: number) {
    const usedTypes = new Set(
      accountsState.filter((_, i) => i !== index).map((acc) => acc.type)
    );
    return allAccountTypes.filter((t) => !usedTypes.has(t));
  }

  // simple form validation
  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    // total balance must be a number
    if (isEmptyString(totalBalance) || isNaN(Number(totalBalance))) {
      newErrors.totalBalance = "Please enter a valid number.";
    }

    // filter out empty accounts
    const filledAccounts = accountsState.filter(
      (acc) => !isEmptyString(acc.type) || !isEmptyString(acc.balance)
    );

    // at least one account must exist
    if (filledAccounts.length === 0) {
      newErrors.atLeastOne = "At least one account is required.";
    }

    filledAccounts.forEach((acc) => {
      if (isEmptyString(acc.type)) {
        newErrors.newAccount = "Select an account type.";
      }

      if (isEmptyString(acc.balance) || isNaN(Number(acc.balance))) {
        newErrors.accountBalance = "Enter a valid balance.";
      }
    });

    // contains the errors, i can show them in the form
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // payload contains the total balance and the accounts after changes
    // tis is what will be sent to the server
    const payload: UpdateOverviewPayload = {
      totalBalance: Number(totalBalance.trim()),
      accounts: accountsState
        .filter((acc) => !isEmptyString(acc.type))
        .map((acc) => ({
          type: acc.type as AccountType,
          balance: Number(acc.balance.trim()),
        })),
    };

    console.log("Submitting payload:", payload);
    updateOverviewMutation.mutate(payload);

    // TODO : call mutation
  };

  const updateOverviewMutation = useMutation({
    // sends the update to the backend, doesn't wait to finish to update UI
    mutationFn: (updatedOverview: UpdateOverviewPayload) =>
      axiosAuth.put("/dashboard/overview", updatedOverview),
    // runs immediately when i click 'Save"
    // this runs before the PUT request is send, i can do optimistic updates here
    // cancel queries: because maybe another refetch is happening at the same time
    // cancel it to avoid UI flickering or outdated data ( race conditions )
    onMutate: async (updatedOverview: UpdateOverviewPayload) => {
      await queryClient.cancelQueries({ queryKey: ["dashboardData"] });

      const previousOverview = queryClient.getQueryData<DashboardData>([
        "dashboardData",
      ]);

      // Optimistic update
      queryClient.setQueryData<DashboardData>(["dashboardData"], (old) => {
        if (!old) return old;
        return {
          ...old,
          totalBalance: updatedOverview.totalBalance,
          accounts: updatedOverview.accounts.map((acc, i) => ({
            ...old.accounts[i], // preserve _id, userId, createdAt if exists
            type: acc.type,
            balance: acc.balance,
          })),
        };
      });

      return { previousOverview };
    },

    // runs after a successfuly PUT request
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      console.log("Overview updated successfully");
      onClose(); // close the modal
    },

    // if request fails: restore the old value (from previous)
    onError: (_err, _updatedOverview, context) => {
      console.log("Error updating overview:", _err);
      if (context?.previousOverview) {
        queryClient.setQueryData(["dashboardData"], context.previousOverview);
      }
    },
  });

  const { isPending, isError, error } = updateOverviewMutation;

  if (isError) <ErrorState message="An error has occured" />;
  return (
    <div
      className="flex flex-col items-center h-full justify-evenly"
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
      <h2 className="text-xl font-semibold">Editing Overview</h2>
      {errors.generalError && (
        <p className="text-red-500">
          Form contains errors, please check again.
        </p>
      )}
      <form
        className="relative flex flex-col items-center justify-center w-full max-w-xl gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-between w-full">
          <div className="relative flex flex-col gap-3 px-1">
            {/* Total balance is based on accounts balance */}
            <p className="">
              Total Balance:{" "}
              {formatCurrency(Number(totalBalance), currencySymbol)}
            </p>

            <SeparatorLine />

            <div className="flex flex-col items-center gap-3 rounded-md">
              <p className="self-start">Your accounts</p>
              {errors.atLeastOne && (
                <span className="absolute text-red-500 right-5">
                  {errors.atLeastOne}
                </span>
              )}
              {accountsState.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full gap-2 rounded-md"
                >
                  <select
                    className=" appearance-none border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 w-full"
                    value={account.type}
                    onChange={(e) =>
                      setAccountsState((prev) =>
                        prev.map((acc, i) =>
                          i === index
                            ? { ...acc, type: e.target.value as AccountType }
                            : acc
                        )
                      )
                    }
                  >
                    <option value="">--- Select ---</option>
                    {/* only account types that aren't already displayed are in the options dropdown */}
                    {getAvailableAccountTypes(index)
                      .concat(account.type ? [account.type] : [])
                      .filter((v, i, arr) => arr.indexOf(v) === i)
                      .map((t) => (
                        <option key={t} value={t}>
                          {/* TODO find a better way to capitalize */}
                          {t[0].toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                  </select>

                  <input
                    className="border border-(--secondary-blue) rounded-md p-2 focus:outline-none focus:border-cyan-500 w-full"
                    type="text"
                    value={account.balance}
                    onChange={(e) =>
                      setAccountsState((prev) =>
                        prev.map((acc, i) =>
                          i === index
                            ? { ...acc, balance: e.target.value }
                            : acc
                        )
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeAccount(index)}
                    className="p-1 text-red-500 hover:scale-120"
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="self-center p-2 border rounded-md border-emerald-600 focus:outline-none focus:border-cyan-500 w-fit disabled:opacity-50"
                onClick={addAccount}
                disabled={accountsState.length >= MAX_ACCOUNTS}
              >
                Add Account
              </button>
            </div>
          </div>

          <div className="flex items-center self-center w-full p-3 justify-evenly">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border-l border-r border-red-500 rounded-full hover:text-red-600"
              aria-label="Cancel changes"
              disabled={isPending}
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
    </div>
  );
}

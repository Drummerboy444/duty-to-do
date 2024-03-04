import { UserProfile, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { ACCOUNT_ROUTE } from "~/utils/routing";

const DeleteAccountButton = () => {
  const [open, setOpen] = useState(false);
  const clerk = useClerk();

  const { mutate: deleteMe, isLoading: isDeletingMe } =
    api.users.deleteMe.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            setOpen(false);
            await clerk.signOut();
            toast.success("Successfully deleted your account");
            return;
          }

          case "UNKNOWN_ERROR": {
            setOpen(false);
            toast.error(
              "Something went wrong while deleting your account, please try again later",
            );
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setOpen(false);
        toast.error(
          "Something went wrong while deleting your account, please try again later",
        );
      },
    });

  return (
    <>
      <Button
        warn
        label="Delete Account"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Delete Account"
        open={open}
        onOpenChange={setOpen}
        content={
          <p>
            Are you sure you want to delete your account? This action will
            delete all of your activity collections and cannot be undone.
          </p>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isDeletingMe && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
              }}
              disabled={isDeletingMe}
            />

            <Button
              label="Delete"
              warn
              onClick={() => {
                deleteMe();
              }}
              disabled={isDeletingMe}
            />
          </div>
        }
      ></Dialog>
    </>
  );
};

export default function AccountPage() {
  return (
    <main className="flex flex-col items-center gap-4 pb-12 pt-4 sm:pt-8 lg:pt-12">
      <UserProfile routing="path" path={ACCOUNT_ROUTE} />
      <div className="z-10">
        <DeleteAccountButton />
      </div>
    </main>
  );
}

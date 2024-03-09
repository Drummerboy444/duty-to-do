import { useState } from "react";
import toast from "react-hot-toast";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { IconButton } from "../IconButton";
import { TrashIcon } from "@radix-ui/react-icons";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../Button";

export const UnshareActivityCollectionButton = ({
  sharedWithId,
  refetch,
}: {
  sharedWithId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { mutate: unshare, isLoading: isUnsharing } =
    api.activityCollections.unshare.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            toast.success("Successfully removed user");
            return;
          }

          case "ACCESS_DENIED": {
            setOpen(false);
            toast.error("You do not have permission to remove this user");
            return;
          }

          case "NO_SHARE_WITH_FOUND": {
            setOpen(false);
            toast.error("This user does not exist on this activity collection");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something when wrong while removing this user, please try again later",
        );
      },
    });

  return (
    <>
      <IconButton
        icon={<TrashIcon />}
        warn
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Remove user"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
        }}
        content={
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to remove this user?</p>

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isUnsharing && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
              }}
              disabled={isUnsharing}
            />

            <Button
              label="Remove"
              warn
              onClick={() => {
                unshare({
                  sharedWithId,
                });
              }}
              disabled={isUnsharing}
            />
          </div>
        }
      />
    </>
  );
};

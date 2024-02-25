import { useState } from "react";
import toast from "react-hot-toast";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { Dialog } from "./Dialog";
import { IconButton } from "./IconButton";
import { TrashIcon } from "@radix-ui/react-icons";
import { ErrorCallout } from "./ErrorCallout";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./Button";

export const DeleteActivityCollectionButton = ({
  activityCollectionId,
  refetch,
}: {
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    mutate: deleteActivityCollection,
    isLoading: isDeletingActivityCollection,
  } = api.activityCollection.delete.useMutation({
    onSuccess: async ({ type }) => {
      switch (type) {
        case "SUCCESS": {
          await refetch();
          setOpen(false);
          toast.success("Successfully delete activity collection");
          return;
        }

        case "NO_ACTIVITY_COLLECTION_FOUND": {
          setOpen(false);
          toast.error("This activity collection does not exist");
          return;
        }

        case "ACCESS_DENIED": {
          setOpen(false);
          toast.error(
            "You do not have permission to delete this activity collection",
          );
          return;
        }

        default: {
          absurd(type);
        }
      }
    },
    onError: () => {
      setErrorMessage(
        "Something went wrong while deleting this activity collection, please try again later",
      );
    },
  });

  return (
    <>
      <IconButton
        icon={<TrashIcon />}
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Delete Activity Collection"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
        }}
        content={
          <div className="flex flex-col gap-4">
            <p>This action cannot be undone.</p>

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isDeletingActivityCollection && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
              }}
              disabled={isDeletingActivityCollection}
            />

            <Button
              label="Delete"
              onClick={() => {
                deleteActivityCollection({
                  id: activityCollectionId,
                });
              }}
              disabled={isDeletingActivityCollection}
            />
          </div>
        }
      />
    </>
  );
};

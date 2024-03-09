import { Share1Icon } from "@radix-ui/react-icons";
import { FlatIconButton } from "./IconButton";
import { useState } from "react";
import { api } from "~/utils/api";
import { absurd } from "~/utils/absurd";
import toast from "react-hot-toast";
import { Dialog } from "./Dialog";
import { ErrorCallout } from "./ErrorCallout";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./Button";

export const SharedWithTag = ({
  activityCollectionId,
  refetch,
}: {
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { mutate: removeMe, isLoading: isRemovingMe } =
    api.activityCollections.removeMe.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            toast.success("Successfully removed activity collection");
            return;
          }

          case "NOT_SHARED_WITH": {
            setOpen(false);
            toast.error("This activity collection is not shared with you");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrong while removing this activity collection, please try again later",
        );
      },
    });

  return (
    <>
      <FlatIconButton
        icon={<Share1Icon />}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      />

      <Dialog
        title="Shared activity collection"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
        }}
        content={
          <div className="flex flex-col gap-4">
            <p>
              This activity collection has been shared with you. You can remove
              yourself from this activity collection, but you will not be able
              to access it again unless the owner readds you.
            </p>

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isRemovingMe && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
              }}
              disabled={isRemovingMe}
            />

            <Button
              label="Remove"
              warn
              onClick={() => {
                removeMe({ activityCollectionId });
              }}
              disabled={isRemovingMe}
            />
          </div>
        }
      />
    </>
  );
};

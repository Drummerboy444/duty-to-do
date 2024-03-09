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

export const DeleteActivityButton = ({
  activityId,
  refetch,
}: {
  activityId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { mutate: deleteActivity, isLoading: isDeletingActivity } =
    api.activities.delete.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            toast.success("Successfully deleted activity");
            return;
          }

          case "ACCESS_DENIED": {
            setOpen(false);
            toast.error("You do not have permission to delete this activity");
            return;
          }

          case "NO_ACTIVITY_FOUND": {
            setOpen(false);
            toast.error("This activity does not exist");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrong while deleting this activity, please try again later",
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
        title="Delete activity"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
        }}
        content={
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this activity? This action cannot
              be undone.
            </p>

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isDeletingActivity && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
              }}
              disabled={isDeletingActivity}
            />

            <Button
              label="Delete"
              warn
              onClick={() => {
                deleteActivity({
                  id: activityId,
                });
              }}
              disabled={isDeletingActivity}
            />
          </div>
        }
      />
    </>
  );
};

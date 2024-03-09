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

export const DeleteTagButton = ({
  tagId,
  refetch,
}: {
  tagId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { mutate: deleteTag, isLoading: isDeletingTag } =
    api.tags.delete.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            toast.success("Successfully deleted tag");
            return;
          }

          case "ACCESS_DENIED": {
            setOpen(false);
            toast.error("You do not have permission to delete this tag");
            return;
          }

          case "NO_TAG_FOUND": {
            setOpen(false);
            toast.error("This tag does not exist");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrong while deleting this tag, please try again later",
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
        title="Delete tag"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
        }}
        content={
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this tag? This action cannot be
              undone.
            </p>

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isDeletingTag && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
              }}
              disabled={isDeletingTag}
            />

            <Button
              label="Delete"
              warn
              onClick={() => {
                deleteTag({
                  id: tagId,
                });
              }}
              disabled={isDeletingTag}
            />
          </div>
        }
      />
    </>
  );
};

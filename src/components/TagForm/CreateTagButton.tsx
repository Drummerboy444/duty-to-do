import { useState } from "react";
import { TagForm, type TagFormState } from "./TagForm";
import { api } from "~/utils/api";
import { absurd } from "~/utils/absurd";
import toast from "react-hot-toast";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";

export const CreateTagButton = ({
  activityCollectionId,
  refetch,
}: {
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<TagFormState>({ name: "" });

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setFormState({ name: "" });
    setErrorMessage(undefined);
  };

  const { mutate: createTag, isLoading: isCreatingTag } =
    api.tags.create.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            clearState();
            toast.success("Successfully created tag");
            return;
          }

          case "NO_ACTIVITY_COLLECTION_FOUND": {
            setErrorMessage("This activity collection does not exist");
            return;
          }

          case "ACCESS_DENIED": {
            setErrorMessage(
              "You do not have permission to edit this activity collection",
            );
            return;
          }

          case "EMPTY_NAME": {
            setErrorMessage("Name cannot be empty");
            return;
          }

          case "TAG_ALREADY_EXISTS": {
            setErrorMessage("A tag with this name already exists");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrong while creating your tag, please try again later",
        );
      },
    });

  return (
    <>
      <Button
        label="Create Tag"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Create Tag"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
        content={
          <div className="flex flex-col gap-4">
            <TagForm
              formState={formState}
              onFormStateChange={(formStateChange) => {
                setFormState({ ...formState, ...formStateChange });
              }}
            />

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isCreatingTag && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isCreatingTag}
            />

            <Button
              label="Create"
              onClick={() => {
                createTag({ activityCollectionId, ...formState });
              }}
              disabled={isCreatingTag}
            />
          </div>
        }
      />
    </>
  );
};

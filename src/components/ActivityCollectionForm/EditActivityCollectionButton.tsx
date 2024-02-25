import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/Button";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  ActivityCollectionForm,
  type ActivityCollectionFormState,
} from "./ActivityCollectionForm";
import { IconButton } from "../IconButton";
import { Pencil1Icon } from "@radix-ui/react-icons";

export const EditActivityCollectionButton = ({
  activityCollectionId,
  defaultValues,
  refetch,
}: {
  activityCollectionId: string;
  defaultValues: ActivityCollectionFormState;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] =
    useState<ActivityCollectionFormState>(defaultValues);

  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    mutate: editActivityCollection,
    isLoading: isEditingActivityCollection,
  } = api.activityCollection.edit.useMutation({
    onSuccess: async ({ type }) => {
      switch (type) {
        case "SUCCESS": {
          await refetch();
          setOpen(false);
          setErrorMessage(undefined);
          toast.success("Successfully edited activity collection");
          return;
        }

        case "EMPTY_NAME": {
          setErrorMessage("Name cannot be empty");
          return;
        }

        case "EMPTY_DESCRIPTION": {
          setErrorMessage("Description cannot be empty");
          return;
        }

        case "ACTIVITY_COLLECTION_ALREADY_EXISTS": {
          setErrorMessage(
            "An activity collection with this name already exists",
          );
          return;
        }

        case "NO_ACTIVITY_COLLECTION_FOUND": {
          setOpen(false);
          setErrorMessage(undefined);
          setFormState(defaultValues);
          toast.error("This activity collection does not exist");
          return;
        }

        case "ACCESS_DENIED": {
          setOpen(false);
          setErrorMessage(undefined);
          setFormState(defaultValues);
          toast.error(
            "You do not have permission to edit this activity collection",
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
        "Something went wrote while editing you activity collection, please try again later",
      );
    },
  });

  return (
    <>
      <IconButton
        icon={<Pencil1Icon />}
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Edit Activity Collection"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          setErrorMessage(undefined);
          setFormState(defaultValues);
        }}
        content={
          <div className="flex flex-col gap-4">
            <ActivityCollectionForm
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
            {isEditingActivityCollection && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                setErrorMessage(undefined);
                setFormState(defaultValues);
              }}
              disabled={isEditingActivityCollection}
            />

            <Button
              label="Save"
              onClick={() => {
                editActivityCollection({
                  id: activityCollectionId,
                  ...formState,
                });
              }}
              disabled={isEditingActivityCollection}
            />
          </div>
        }
      />
    </>
  );
};

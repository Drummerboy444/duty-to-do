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

export const CreateActivityCollectionButton = ({
  refetch,
}: {
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<ActivityCollectionFormState>({
    name: "",
    description: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setFormState({ name: "", description: "" });
    setErrorMessage(undefined);
  };

  const {
    mutate: createActivityCollection,
    isLoading: isCreatingActivityCollection,
  } = api.activityCollections.create.useMutation({
    onSuccess: async ({ type }) => {
      switch (type) {
        case "SUCCESS": {
          await refetch();
          setOpen(false);
          clearState();
          toast.success("Successfully created activity collection");
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

        default: {
          absurd(type);
        }
      }
    },
    onError: () => {
      setErrorMessage(
        "Something went wrote while creating your activity collection, please try again later",
      );
    },
  });

  return (
    <>
      <Button
        label="Create Activity Collection"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Create Activity Collection"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          clearState();
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
            {isCreatingActivityCollection && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isCreatingActivityCollection}
            />

            <Button
              label="Create"
              onClick={() => {
                createActivityCollection(formState);
              }}
              disabled={isCreatingActivityCollection}
            />
          </div>
        }
      />
    </>
  );
};

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "~/components/Button";
import { api } from "~/utils/api";
import {
  ActivityCollectionForm,
  type ActivityCollectionFormState,
} from "./ActivityCollectionForm";
import { absurd } from "~/utils/absurd";
import toast from "react-hot-toast";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";

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

  const {
    mutate: createActivityCollection,
    isLoading: isCreatingActivityCollection,
  } = api.activityCollection.create.useMutation({
    onSuccess: async ({ type }) => {
      switch (type) {
        case "SUCCESS": {
          await refetch();
          setOpen(false);
          setFormState({ name: "", description: "" });
          setErrorMessage(undefined);
          toast.success("Successfully create activity collection");
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
        "Something went wrote while creating you activity collection, please try again later",
      );
    },
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        console.log("On open change...");
        setOpen(open);
        setFormState({ name: "", description: "" });
        setErrorMessage(undefined);
      }}
    >
      <Button
        label="Create Activity Collection"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 dark:opacity-50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 flex w-5/6 max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-white px-12 py-8 shadow-2xl dark:bg-zinc-900">
          <Dialog.Title className="text-2xl">
            Create Activity Collection
          </Dialog.Title>

          <ActivityCollectionForm
            formState={formState}
            onFormStateChange={(formStateChange) => {
              setFormState({ ...formState, ...formStateChange });
            }}
          />

          {errorMessage !== undefined && (
            <ErrorCallout message={errorMessage} />
          )}

          <div className="flex items-center justify-end gap-4">
            {isCreatingActivityCollection && <LoadingSpinner />}

            <Dialog.Close asChild>
              <Button
                label="Cancel"
                onClick={() => {
                  setOpen(false);
                }}
                disabled={isCreatingActivityCollection}
              />
            </Dialog.Close>

            <Button
              label="Confirm"
              onClick={() => {
                setErrorMessage(undefined);
                createActivityCollection(formState);
              }}
              disabled={isCreatingActivityCollection}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

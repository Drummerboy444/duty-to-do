import { useState } from "react";
import { ActivityForm, type ActivityFormState } from "./ActivityForm";
import { api } from "~/utils/api";
import { absurd } from "~/utils/absurd";
import toast from "react-hot-toast";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";

export const CreateActivityButton = ({
  activityCollectionId,
  allTags,
  refetch,
}: {
  activityCollectionId: string;
  allTags: { id: string; name: string }[];
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<ActivityFormState>({
    name: "",
    tagIds: [],
  });

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setFormState({ name: "", tagIds: [] });
    setErrorMessage(undefined);
  };

  const { mutate: createActivity, isLoading: isCreatingActivity } =
    api.activities.create.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            clearState();
            toast.success("Successfully created activity");
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

          case "ACTIVITY_ALREADY_EXISTS": {
            setErrorMessage("An activity with this name already exists");
            return;
          }

          case "INVALID_TAG_IDS": {
            setErrorMessage(
              "These tags do not belong to this activity collection",
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
          "Something went wrong while creating your activity, please try again later",
        );
      },
    });

  return (
    <>
      <Button
        label="Create Activity"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Create Activity"
        open={open}
        onOpenChange={(open) => {
          clearState();
          setOpen(open);
        }}
        content={
          <div className="flex flex-col gap-4">
            <ActivityForm
              formState={formState}
              onFormStateChange={(formStateChange) => {
                setFormState({ ...formState, ...formStateChange });
              }}
              allTags={allTags}
            />

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isCreatingActivity && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isCreatingActivity}
            />

            <Button
              label="Create"
              onClick={() => {
                createActivity({ activityCollectionId, ...formState });
              }}
              disabled={isCreatingActivity}
            />
          </div>
        }
      />
    </>
  );
};

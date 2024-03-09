import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/Button";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { LoadingSpinner } from "../LoadingSpinner";
import { IconButton } from "../IconButton";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ActivityForm, type ActivityFormState } from "./ActivityForm";

export const EditActivityButton = ({
  activityId,
  defaultValues,
  allTags,
  refetch,
}: {
  activityId: string;
  defaultValues: ActivityFormState;
  allTags: { id: string; name: string }[];
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<ActivityFormState>(defaultValues);

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setErrorMessage(undefined);
    setFormState(defaultValues);
  };

  const { mutate: editActivity, isLoading: isEditingActivity } =
    api.activities.edit.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            setErrorMessage(undefined);
            toast.success("Successfully edited activity");
            return;
          }

          case "ACCESS_DENIED": {
            setErrorMessage("You do not have permission to edit this activity");
            return;
          }

          case "EMPTY_NAME": {
            setErrorMessage("Name cannot be empty");
            return;
          }

          case "INVALID_TAG_IDS": {
            setErrorMessage(
              "These tags do not belong to this activity collection",
            );
            return;
          }

          case "ACTIVITY_ALREADY_EXISTS": {
            setErrorMessage("An activity with this name already exists");
            return;
          }

          case "NO_ACTIVITY_FOUND": {
            setErrorMessage("This activity does not exist");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrote while editing your activity, please try again later",
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
        title="Edit Activity"
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
            {isEditingActivity && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isEditingActivity}
            />

            <Button
              label="Save"
              onClick={() => {
                editActivity({
                  id: activityId,
                  ...formState,
                });
              }}
              disabled={isEditingActivity}
            />
          </div>
        }
      />
    </>
  );
};

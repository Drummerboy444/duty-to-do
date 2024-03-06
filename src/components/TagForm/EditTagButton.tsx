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
import { TagForm, type TagFormState } from "./TagForm";

export const EditTagButton = ({
  tagId,
  defaultValues,
  refetch,
}: {
  tagId: string;
  defaultValues: TagFormState;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<TagFormState>(defaultValues);

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setErrorMessage(undefined);
    setFormState(defaultValues);
  };

  const { mutate: editTag, isLoading: isEditingTag } =
    api.tags.edit.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            setErrorMessage(undefined);
            toast.success("Successfully edited tag");
            return;
          }

          case "ACCESS_DENIED": {
            setErrorMessage("You do not have permission to edit this tag");
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

          case "NO_TAG_FOUND": {
            setErrorMessage("This tag does not exist");
            return;
          }

          default: {
            absurd(type);
          }
        }
      },
      onError: () => {
        setErrorMessage(
          "Something went wrote while editing your tag, please try again later",
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
        title="Edit Tag"
        open={open}
        onOpenChange={(open) => {
          clearState();
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
            {isEditingTag && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isEditingTag}
            />

            <Button
              label="Save"
              onClick={() => {
                editTag({
                  id: tagId,
                  ...formState,
                });
              }}
              disabled={isEditingTag}
            />
          </div>
        }
      />
    </>
  );
};

import { useState } from "react";
import { Button } from "../Button";
import { api } from "~/utils/api";
import { absurd } from "~/utils/absurd";
import toast from "react-hot-toast";
import { Dialog } from "../Dialog";
import { ErrorCallout } from "../ErrorCallout";
import { TextInput } from "../TextInput";
import { LoadingSpinner } from "../LoadingSpinner";

export const ShareActivityCollectionButton = ({
  activityCollectionId,
  refetch,
}: {
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("");

  const [errorMessage, setErrorMessage] = useState<string>();

  const clearState = () => {
    setUsername("");
    setErrorMessage(undefined);
  };

  const { mutate: share, isLoading: isSharing } =
    api.activityCollections.share.useMutation({
      onSuccess: async ({ type }) => {
        switch (type) {
          case "SUCCESS": {
            await refetch();
            setOpen(false);
            clearState();
            toast.success("Successfully shared activity collection");
            return;
          }

          case "NO_ACTIVITY_COLLECTION_FOUND": {
            setErrorMessage("This activity collection does not exist");
            return;
          }

          case "ACCESS_DENIED": {
            setErrorMessage(
              "You do no have permission to share this activity collection",
            );
            return;
          }

          case "NO_USER_FOUND": {
            setErrorMessage("No user with this username exists");
            return;
          }

          case "ALREADY_SHARED": {
            setErrorMessage(
              "This user already has access to this activity collection",
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
          "Something went wrong while sharing your activity collection, please try again later",
        );
      },
    });

  return (
    <>
      <Button
        label="Share"
        onClick={() => {
          setOpen(true);
        }}
      />

      <Dialog
        title="Share Activity Collection"
        open={open}
        onOpenChange={(open) => {
          clearState();
          setOpen(open);
        }}
        content={
          <div className="flex flex-col gap-4">
            <TextInput
              value={username}
              setValue={(value) => {
                setUsername(value);
              }}
              label="Username"
            />

            {errorMessage !== undefined && (
              <ErrorCallout message={errorMessage} />
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            {isSharing && <LoadingSpinner />}

            <Button
              label="Cancel"
              onClick={() => {
                setOpen(false);
                clearState();
              }}
              disabled={isSharing}
            />

            <Button
              label="Share"
              onClick={() => {
                share({ activityCollectionId, username });
              }}
              disabled={isSharing}
            />
          </div>
        }
      />
    </>
  );
};

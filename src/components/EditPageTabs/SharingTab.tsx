import Image from "next/image";
import { ShareActivityCollectionButton } from "./ShareActivityCollectionButton";
import { UnshareActivityCollectionButton } from "./UnshareActivityCollectionButton";

const SharingRow = ({
  sharedWith: { id, user },
  canEdit,
  refetch,
}: {
  sharedWith: {
    id: string;
    user:
      | {
          id: string;
          username: string | null;
          imageUrl: string;
        }
      | "UNKNOWN_USER";
  };
  canEdit: boolean;
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
      {user === "UNKNOWN_USER" ? (
        <p>Unknown user</p>
      ) : (
        <>
          <Image
            className="rounded-full"
            src={user.imageUrl}
            width={27}
            height={27}
            alt="User avatar"
          />
          <p>{user.username === null ? "Unknown user" : user.username}</p>
          {canEdit && (
            <>
              <div className="grow" />
              <UnshareActivityCollectionButton
                sharedWithId={id}
                refetch={refetch}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export const SharingTab = ({
  activityCollectionId,
  sharedWith,
  canEdit,
  refetch,
}: {
  activityCollectionId: string;
  sharedWith: {
    id: string;
    user:
      | {
          id: string;
          username: string | null;
          imageUrl: string;
        }
      | "UNKNOWN_USER";
  }[];
  canEdit: boolean;
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {canEdit ? (
        <div>
          <ShareActivityCollectionButton
            activityCollectionId={activityCollectionId}
            refetch={refetch}
          />
        </div>
      ) : (
        <p className="italic text-gray-500">
          Only the owner of this activity collection can add and remove users
        </p>
      )}

      {sharedWith.map(({ id, user }) => (
        <SharingRow
          key={id}
          sharedWith={{ id, user }}
          canEdit={canEdit}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

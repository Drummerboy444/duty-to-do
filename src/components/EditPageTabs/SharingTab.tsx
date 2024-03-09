import Image from "next/image";
import { ShareActivityCollectionButton } from "./ShareActivityCollectionButton";
import { UnshareActivityCollectionButton } from "./UnshareActivityCollectionButton";

const SharingRow = ({
  sharedWith: { id, user },
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
          <div className="grow" />
          <UnshareActivityCollectionButton
            sharedWithId={id}
            refetch={refetch}
          />
        </>
      )}
    </div>
  );
};

export const SharingTab = ({
  activityCollectionId,
  sharedWith,
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
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <ShareActivityCollectionButton
          activityCollectionId={activityCollectionId}
          refetch={refetch}
        />
      </div>

      {sharedWith.map(({ id, user }) => (
        <SharingRow key={id} sharedWith={{ id, user }} refetch={refetch} />
      ))}
    </div>
  );
};

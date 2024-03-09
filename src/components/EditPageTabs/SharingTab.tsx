import Image from "next/image";

export const SharingTab = ({
  activityCollectionId,
  sharedWith,
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
}) => {
  return (
    <div className="flex flex-col gap-4">
      {sharedWith.map(({ id, user }) => (
        <div
          key={id}
          className="flex items-center gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500"
        >
          {user === "UNKNOWN_USER" ? (
            <p>Unknown user</p>
          ) : (
            <>
              <Image
                className="rounded-full"
                src={user.imageUrl}
                width={32}
                height={32}
                alt="User avatar"
              />
              <p>{user.username === null ? "Unknown user" : user.username}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

import { Avatar } from "./Avatar";

export const SharedWithYouInfo = ({
  username,
  imageUrl,
}: {
  username: string;
  imageUrl: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="italic text-gray-500">Shared with you by {username}</p>
      <Avatar imageUrl={imageUrl} />
    </div>
  );
};

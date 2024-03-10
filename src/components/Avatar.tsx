import Image from "next/image";

export const Avatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Image
      className="rounded-full"
      src={imageUrl}
      width={27}
      height={27}
      alt="User avatar"
    />
  );
};

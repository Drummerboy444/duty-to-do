import { IdCardIcon } from "@radix-ui/react-icons";

export const LoadingSpinner = ({ size }: { size?: string }) => {
  return (
    <IdCardIcon
      className="animate-spin"
      {...(size === undefined ? {} : { width: size, height: size })}
    />
  );
};

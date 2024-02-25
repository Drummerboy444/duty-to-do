import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCallout = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-red-200 dark:bg-red-800 dark:text-red-300">
      <div className="flex items-center">
        <ExclamationTriangleIcon />
      </div>
      <p>{message}</p>
    </div>
  );
};

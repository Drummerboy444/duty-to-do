import { type ReactNode } from "react";
import { noOp } from "~/utils/no-op";

export const IconButton = ({
  icon,
  onClick = noOp,
  disabled = false,
}: {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded bg-sky-500 p-2 text-white shadow hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {icon}
    </button>
  );
};

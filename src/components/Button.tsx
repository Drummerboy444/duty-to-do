import { type MouseEventHandler } from "react";
import { noOp } from "~/utils/no-op";

export const Button = ({
  label,
  onClick = noOp,
  warn = false,
  disabled = false,
}: {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  warn?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded ${warn ? "bg-red-500" : "bg-sky-500"} px-3 py-1 text-white shadow ${warn ? "hover:bg-red-600" : "hover:bg-sky-600"} ${warn ? "active:bg-red-700" : "active:bg-sky-700"} disabled:cursor-not-allowed disabled:bg-gray-400`}
    >
      {label}
    </button>
  );
};

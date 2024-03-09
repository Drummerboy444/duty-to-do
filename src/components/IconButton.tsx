import { type MouseEventHandler, type ReactNode } from "react";
import { noOp } from "~/utils/no-op";

export const IconButton = ({
  icon,
  onClick = noOp,
  warn = false,
  disabled = false,
}: {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  warn?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded ${warn ? "bg-red-500" : "bg-sky-500"} p-1.5 text-white shadow ${warn ? "hover:bg-red-600" : "hover:bg-sky-600"} ${warn ? "active:bg-red-700" : "active:bg-sky-700"} disabled:cursor-not-allowed disabled:bg-gray-400`}
    >
      {icon}
    </button>
  );
};

export const FlatIconButton = ({
  icon,
  onClick = noOp,
}: {
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  warn?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button onClick={onClick} className="rounded p-1.5 text-sky-500">
      {icon}
    </button>
  );
};

import { noOp } from "~/utils/no-op";

export const Button = ({
  label,
  onClick = noOp,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded bg-sky-500 px-3 py-1 text-white shadow hover:bg-sky-600 active:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {label}
    </button>
  );
};

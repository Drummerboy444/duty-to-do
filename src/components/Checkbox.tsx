import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export const Checkbox = ({
  checked,
  setChecked,
  label,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        checked={checked}
        onCheckedChange={(checked) => {
          if (checked === "indeterminate") return;
          setChecked(checked);
        }}
        className="flex h-5 w-5 items-center justify-center rounded-sm border border-gray-300 data-[state=checked]:bg-sky-500 dark:border-gray-700"
      >
        <RadixCheckbox.Indicator className="text-white">
          <CheckIcon />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <p>{label}</p>
    </div>
  );
};

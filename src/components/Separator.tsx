import * as RadixSeparator from "@radix-ui/react-separator";

export const Separator = ({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) => (
  <RadixSeparator.Root
    decorative
    orientation={orientation}
    className="bg-gray-300 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px dark:bg-gray-700"
  />
);

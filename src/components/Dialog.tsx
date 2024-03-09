import * as RadixDialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";

export const Dialog = ({
  title,
  open,
  onOpenChange,
  content,
  footer,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ReactNode;
  footer: ReactNode;
}) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-20 bg-black opacity-30 dark:opacity-50" />

        <RadixDialog.Content
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="fixed left-1/2 top-1/2 z-30 flex max-h-[calc(100%-2rem)] w-5/6 max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-white px-12 py-8 shadow-2xl dark:bg-zinc-900"
        >
          <RadixDialog.Title className="text-2xl">{title}</RadixDialog.Title>

          <div className="overflow-auto px-6">{content}</div>

          {footer}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

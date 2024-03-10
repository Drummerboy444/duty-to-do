import { MagicWandIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { TagChip } from "./TagChip";

export const RandomActivityButton = ({
  choices,
}: {
  choices: { name: string; tags: { id: string; name: string }[] }[];
}) => {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<(typeof choices)[number]>();

  return (
    <>
      <MagicWandIcon
        className="cursor-pointer"
        onClick={() => {
          setChoice(choices[Math.floor(Math.random() * choices.length)]);
          setOpen(true);
        }}
      />

      <Dialog
        title="🎲 Random Choice 🎲"
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
        content={
          choice === undefined ? (
            <p>There are no options available with these tags...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-lg">{choice.name}</p>
              {choice.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {choice.tags.map((tag) => (
                    <TagChip key={tag.id} tag={tag} small />
                  ))}
                </div>
              )}
            </div>
          )
        }
        footer={
          <div className="flex items-center justify-end gap-4">
            <Button
              label="Close"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        }
      />
    </>
  );
};

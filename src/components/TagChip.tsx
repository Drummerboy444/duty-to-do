import { stringToColour } from "~/utils/string-to-colour";

const getTagColour = (tagId: string) =>
  stringToColour({
    string: tagId,
    saturationPercentage: 100,
    lightnessPercentage: 75,
  });

export const TagChip = ({
  tag: { id, name },
  small = false,
}: {
  tag: { id: string; name: string };
  small?: boolean;
}) => (
  <p
    style={{
      backgroundColor: getTagColour(id),
    }}
    className={`rounded-full px-4 text-black ${small ? "text-sm" : ""}`}
  >
    {name}
  </p>
);

export const SelectableTagChip = ({
  tag: { id, name },
  selected,
  setSelected,
}: {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  tag: { id: string; name: string };
}) => (
  <p
    style={{
      ...(selected ? { backgroundColor: getTagColour(id) } : {}),
    }}
    className={`cursor-pointer select-none rounded-full border px-4 ${selected ? "border-transparent text-black" : "border-gray-300 dark:border-gray-700"}`}
    onClick={() => {
      setSelected(!selected);
    }}
  >
    {name}
  </p>
);

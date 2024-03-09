import { stringToColour } from "~/utils/string-to-colour";

const getTagColour = (tagId: string) =>
  stringToColour({
    string: tagId,
    saturationPercentage: 100,
    lightnessPercentage: 75,
  });

export const TagChip = ({
  tag: { id, name },
}: {
  tag: { id: string; name: string };
}) => (
  <p
    style={{
      backgroundColor: getTagColour(id),
    }}
    className="rounded-full px-4 text-black"
  >
    {name}
  </p>
);

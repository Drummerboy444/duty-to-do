const toCharCode = (c: string) => c.charCodeAt(0);

export const stringToColour = ({
  string,
  saturationPercentage,
  lightnessPercentage,
}: {
  string: string;
  saturationPercentage: number;
  lightnessPercentage: number;
}) =>
  `hsl(${
    string
      .split("")
      .map(toCharCode)
      .reduce((hash, currentValue) => currentValue + ((hash << 5) - hash), 0) %
    360
  }, ${saturationPercentage}%, ${lightnessPercentage}%)`;

export const getTagColour = (tagId: string) =>
  stringToColour({
    string: tagId,
    saturationPercentage: 100,
    lightnessPercentage: 75,
  });

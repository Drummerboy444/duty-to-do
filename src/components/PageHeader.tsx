export const PageHeader = ({
  header,
  subheader,
}: {
  header: string;
  subheader?: string;
}) => (
  <div>
    <h1 className="text-4xl">{header}</h1>
    {subheader !== undefined && (
      <h2 className="text-xl text-gray-500">{subheader}</h2>
    )}
  </div>
);

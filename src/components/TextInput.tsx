export const TextInput = ({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (value: string) => void;
  label?: string;
}) => {
  return (
    <div>
      {label !== undefined && <p>{label}:</p>}
      <input
        value={value}
        onChange={({ target: { value } }) => {
          setValue(value);
        }}
        className="w-full rounded bg-gray-200 px-2 py-1 dark:bg-gray-800"
      />
    </div>
  );
};

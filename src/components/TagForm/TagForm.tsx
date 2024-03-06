import { TextInput } from "../TextInput";

export type TagFormState = {
  name: string;
};

export const TagForm = ({
  formState: { name },
  onFormStateChange,
}: {
  formState: TagFormState;
  onFormStateChange: (formStateChange: Partial<TagFormState>) => void;
}) => {
  return (
    <TextInput
      value={name}
      setValue={(value) => {
        onFormStateChange({ name: value });
      }}
      label="Name"
    />
  );
};

import { TextInput } from "../TextInput";

export type ActivityFormState = {
  name: string;
  tagIds: string[];
};

export const ActivityForm = ({
  formState: { name, tagIds },
  onFormStateChange,
  allTags,
}: {
  formState: ActivityFormState;
  onFormStateChange: (formStateChange: Partial<ActivityFormState>) => void;
  allTags: { id: string; name: string }[];
}) => {
  return (
    <>
      <TextInput
        value={name}
        setValue={(value) => {
          onFormStateChange({ name: value });
        }}
        label="Name"
      />

      <div>To do: Tag editor...</div>
    </>
  );
};

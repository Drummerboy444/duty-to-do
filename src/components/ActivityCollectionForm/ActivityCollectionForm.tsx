import { TextInput } from "../TextInput";

export type ActivityCollectionFormState = {
  name: string;
  description: string;
};

export const ActivityCollectionForm = ({
  formState: { name, description },
  onFormStateChange,
}: {
  formState: ActivityCollectionFormState;
  onFormStateChange: (
    formStateChange: Partial<ActivityCollectionFormState>,
  ) => void;
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
      <TextInput
        value={description}
        setValue={(value) => {
          onFormStateChange({ description: value });
        }}
        label="Description"
      />
    </>
  );
};

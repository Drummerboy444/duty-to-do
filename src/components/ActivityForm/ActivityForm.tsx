import { Checkbox } from "../Checkbox";
import { TagChip } from "../TagChip";
import { TextInput } from "../TextInput";

export type ActivityFormState = {
  name: string;
  tagIds: string[];
};

export const ActivityForm = ({
  formState,
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
        value={formState.name}
        setValue={(value) => {
          onFormStateChange({ name: value });
        }}
        label="Name"
      />

      <div className="flex flex-col gap-4">
        {allTags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2">
            <Checkbox
              checked={formState.tagIds.includes(tag.id)}
              setChecked={(checked) => {
                onFormStateChange({
                  tagIds: allTags
                    .filter((otherTag) => {
                      if (otherTag.id === tag.id) return checked;
                      return formState.tagIds.includes(otherTag.id);
                    })
                    .map(({ id }) => id),
                });
              }}
            />
            <TagChip tag={tag} />
          </div>
        ))}
      </div>
    </>
  );
};

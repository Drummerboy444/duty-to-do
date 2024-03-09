import { TagChip } from "../TagChip";
import { CreateTagButton } from "../TagForm/CreateTagButton";
import { DeleteTagButton } from "../TagForm/DeleteTagButton";
import { EditTagButton } from "../TagForm/EditTagButton";

const TagsEditorRow = ({
  tag,
  refetch,
}: {
  tag: { id: string; name: string };
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
      <TagChip tag={tag} />
      <div className="grow" />
      <DeleteTagButton tagId={tag.id} refetch={refetch} />
      <EditTagButton tagId={tag.id} defaultValues={tag} refetch={refetch} />
    </div>
  );
};

export const TagsEditor = ({
  tags,
  activityCollectionId,
  refetch,
}: {
  tags: { id: string; name: string }[];
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <CreateTagButton
          activityCollectionId={activityCollectionId}
          refetch={refetch}
        />
      </div>

      {tags.map((tag) => (
        <TagsEditorRow key={tag.id} tag={tag} refetch={refetch} />
      ))}
    </div>
  );
};

import { CreateActivityButton } from "../ActivityForm/CreateActivityButton";
import { DeleteActivityButton } from "../ActivityForm/DeleteActivityButton";
import { EditActivityButton } from "../ActivityForm/EditActivityButton";
import { TagChip } from "../TagChip";

const ActivitiesEditorRow = ({
  activity,
  allTags,
  refetch,
}: {
  activity: {
    id: string;
    name: string;
    tags: { id: string; name: string }[];
  };
  allTags: { id: string; name: string }[];
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
      <div className="flex items-start gap-2">
        <p className="text-lg">{activity.name}</p>
        <div className="grow" />
        <DeleteActivityButton activityId={activity.id} refetch={refetch} />
        <EditActivityButton
          activityId={activity.id}
          defaultValues={{
            ...activity,
            tagIds: activity.tags.map(({ id }) => id),
          }}
          allTags={allTags}
          refetch={refetch}
        />
      </div>

      {activity.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activity.tags.map((tag) => (
            <TagChip key={tag.id} tag={tag} small />
          ))}
        </div>
      )}
    </div>
  );
};

export const ActivitiesEditor = ({
  activities,
  allTags,
  activityCollectionId,
  refetch,
}: {
  activities: {
    id: string;
    name: string;
    tags: { id: string; name: string }[];
  }[];
  allTags: { id: string; name: string }[];
  activityCollectionId: string;
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <CreateActivityButton
          activityCollectionId={activityCollectionId}
          allTags={allTags}
          refetch={refetch}
        />
      </div>

      {activities.map((activity) => (
        <ActivitiesEditorRow
          key={activity.id}
          activity={activity}
          allTags={allTags}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

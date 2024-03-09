import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { PageHeader } from "~/components/PageHeader";
import { SelectableTagChip, TagChip } from "~/components/TagChip";
import { useSafeActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { getActivityCollectionEditRoute } from "~/utils/routing";

const ActivityRow = ({
  name,
  tags,
}: {
  name: string;
  tags: { id: string; name: string }[];
}) => (
  <div className="flex flex-col gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
    <p>{name}</p>
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagChip key={tag.id} tag={tag} />
        ))}
      </div>
    )}
  </div>
);

const TagSelector = ({
  selectedTagIds,
  setSelectedTagIds,
  allTags,
}: {
  selectedTagIds: string[];
  setSelectedTagIds: (selectedTagIds: string[]) => void;
  allTags: { id: string; name: string }[];
}) => {
  if (allTags.length === 0) return undefined;

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <SelectableTagChip
          key={tag.id}
          tag={tag}
          selected={selectedTagIds.includes(tag.id)}
          setSelected={(selected) => {
            setSelectedTagIds(
              allTags
                .filter((otherTag) => {
                  if (otherTag.id === tag.id) return selected;
                  return selectedTagIds.includes(otherTag.id);
                })
                .map(({ id }) => id),
            );
          }}
        />
      ))}
    </div>
  );
};

export default function ActivityCollectionPage() {
  const queryParams = useSafeActivityCollectionQueryParams();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const {
    data: activityCollectionData,
    isLoading: isLoadingActivityCollection,
  } = api.activityCollections.get.useQuery(
    queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE"
      ? { id: queryParams.requiredKeysLookup.activityCollectionId }
      : { id: "" },
    {
      enabled:
        queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE",
    },
  );

  if (isLoadingActivityCollection) return <LoadingPage />;

  if (activityCollectionData === undefined)
    return (
      <ErrorPage message="We couldn't find this activity collection, please try again later" />
    );

  switch (activityCollectionData.type) {
    case "NO_ACTIVITY_COLLECTION_FOUND": {
      return <ErrorPage message="This activity collection does not exist" />;
    }

    case "ACCESS_DENIED": {
      return (
        <ErrorPage message="You do not have permission to view this activity collection" />
      );
    }

    case "SUCCESS": {
      const {
        activityCollection: { id, name, description, activities },
      } = activityCollectionData;

      const filteredActivities = activities.filter((activity) =>
        selectedTagIds.every((selectedTagId) =>
          activity.tags.map(({ id }) => id).includes(selectedTagId),
        ),
      );

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <div className="flex justify-between gap-2">
            <PageHeader header={name} subheader={description} />
            <Link className="pt-2" href={getActivityCollectionEditRoute(id)}>
              <Pencil1Icon />
            </Link>
          </div>

          <TagSelector
            selectedTagIds={selectedTagIds}
            setSelectedTagIds={setSelectedTagIds}
            allTags={activityCollectionData.activityCollection.tags}
          />

          {filteredActivities.length > 0 ? (
            <>
              {filteredActivities.map((filteredActivity) => (
                <ActivityRow
                  key={filteredActivity.id}
                  name={filteredActivity.name}
                  tags={filteredActivity.tags}
                />
              ))}
            </>
          ) : (
            <p className="italic text-gray-500">
              No activities found that match these tags
            </p>
          )}

          {activities.length === 0 && (
            <p className="italic text-gray-500">
              You don&apos;t have any activities in this collection, try
              creating one!
            </p>
          )}
        </main>
      );
    }

    default: {
      absurd(activityCollectionData);
    }
  }
}

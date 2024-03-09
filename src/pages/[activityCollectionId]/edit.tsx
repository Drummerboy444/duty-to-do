import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { CreateActivityButton } from "~/components/ActivityForm/CreateActivityButton";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { PageHeader } from "~/components/PageHeader";
import { Separator } from "~/components/Separator";
import { CreateTagButton } from "~/components/TagForm/CreateTagButton";
import { DeleteTagButton } from "~/components/TagForm/DeleteTagButton";
import { EditTagButton } from "~/components/TagForm/EditTagButton";
import { useSafeEditActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { getTagColour } from "~/utils/string-to-colour";

const ActivitiesEditorRow = ({
  activity,
  refetch,
}: {
  activity: {
    id: string;
    name: string;
    tags: { id: string; name: string }[];
  };
  refetch: () => Promise<void>;
}) => {
  return (
    <div>
      This is an activity row - {activity.name}
      {" - "}
      {activity.tags.map(({ name }) => name).join(", ")}
    </div>
  );
};

const ActivitiesEditor = ({
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
          refetch={refetch}
        />
      ))}
    </div>
  );
};

const TagsEditorRow = ({
  tag,
  refetch,
}: {
  tag: { id: string; name: string };
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
      <p
        style={{
          backgroundColor: getTagColour(tag.id),
        }}
        className="rounded-full px-4 text-black"
      >
        {tag.name}
      </p>
      <div className="grow" />
      <DeleteTagButton tagId={tag.id} refetch={refetch} />
      <EditTagButton tagId={tag.id} defaultValues={tag} refetch={refetch} />
    </div>
  );
};

const TagsEditor = ({
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

const EditPageTabs = ({
  tabs,
  defaultTab,
}: {
  tabs: { id: string; displayName: string; content: ReactNode }[];
  defaultTab: string;
}) => {
  const [tab, setTab] = useState(defaultTab);
  const router = useRouter();

  useEffect(() => {
    void router.replace({ query: { ...router.query, tab } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        setTab(value);
      }}
      className="flex flex-col gap-2"
    >
      <Tabs.List className="flex justify-around">
        {tabs.map(({ id, displayName }) => (
          <Tabs.Trigger
            key={id}
            value={id}
            className="border-b-2 border-b-transparent px-8 py-2 data-[state=active]:border-b-sky-500"
          >
            {displayName}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Separator />

      {tabs.map(({ id, content }) => (
        <Tabs.Content key={id} value={id} className="px-4 py-2">
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default function EditActivityCollectionPage() {
  const queryParams = useSafeEditActivityCollectionQueryParams();

  const {
    data: activityCollectionData,
    isLoading: isLoadingActivityCollection,
    refetch: refetchActivityCollection,
  } = api.activityCollections.get.useQuery(
    queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE"
      ? { id: queryParams.requiredKeysLookup.activityCollectionId }
      : { id: "" },
    {
      enabled:
        queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE",
    },
  );

  if (isLoadingActivityCollection || queryParams === "LOADING")
    return <LoadingPage />;

  if (
    activityCollectionData === undefined ||
    queryParams === "QUERY_PARAMS_UNAVAILABLE"
  )
    return (
      <ErrorPage message="We couldn't find this activity collection, please try again later" />
    );

  switch (activityCollectionData.type) {
    case "NO_ACTIVITY_COLLECTION_FOUND": {
      return <ErrorPage message="This activity collection does not exist" />;
    }

    case "ACCESS_DENIED": {
      return (
        <ErrorPage message="You do not have permission to edit this activity collection" />
      );
    }

    case "SUCCESS": {
      const {
        activityCollection: { id, name, description, activities, tags },
      } = activityCollectionData;

      const refetch = async () => {
        await refetchActivityCollection();
      };

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <PageHeader header={name} subheader={description} />
          <EditPageTabs
            defaultTab={
              (queryParams.optionalKeysLookup.tab !== undefined &&
                queryParams.optionalKeysLookup.tab === "activities") ||
              queryParams.optionalKeysLookup.tab === "tags"
                ? queryParams.optionalKeysLookup.tab
                : "activities"
            }
            tabs={[
              {
                id: "activities",
                displayName: "Activities",
                content: (
                  <ActivitiesEditor
                    activities={activities}
                    allTags={tags}
                    activityCollectionId={id}
                    refetch={refetch}
                  />
                ),
              },
              {
                id: "tags",
                displayName: "Tags",
                content: (
                  <TagsEditor
                    tags={tags}
                    activityCollectionId={id}
                    refetch={refetch}
                  />
                ),
              },
            ]}
          />
        </main>
      );
    }

    default: {
      absurd(activityCollectionData);
    }
  }
}

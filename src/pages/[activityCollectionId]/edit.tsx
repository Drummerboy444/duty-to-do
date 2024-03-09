import { useUser } from "@clerk/nextjs";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { ActivitiesEditor } from "~/components/EditPageTabs/ActivitiesEditor";
import { SharingTab } from "~/components/EditPageTabs/SharingTab";
import { TagsEditor } from "~/components/EditPageTabs/TagsEditor";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { PageHeader } from "~/components/PageHeader";
import { Separator } from "~/components/Separator";
import { useSafeEditActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";

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
            className="border-b-2 border-b-transparent px-2 py-2 data-[state=active]:border-b-sky-500 sm:px-4 lg:px-8"
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

  const { user, isLoaded: userIsLoaded } = useUser();

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

  if (isLoadingActivityCollection || queryParams === "LOADING" || !userIsLoaded)
    return <LoadingPage />;

  if (
    activityCollectionData === undefined ||
    queryParams === "QUERY_PARAMS_UNAVAILABLE"
  )
    return (
      <ErrorPage message="We couldn't find this activity collection, please try again later" />
    );

  if (user === null) {
    return (
      <ErrorPage message="We couldn't load your user data, please try again later" />
    );
  }

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
        activityCollection: {
          id,
          name,
          description,
          activities,
          tags,
          sharedWith,
        },
      } = activityCollectionData;

      const refetch = async () => {
        await refetchActivityCollection();
      };

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <PageHeader header={name} subheader={description} />
          <EditPageTabs
            defaultTab={
              queryParams.optionalKeysLookup.tab === undefined
                ? "activities"
                : ["activities", "tags"].includes(
                      queryParams.optionalKeysLookup.tab,
                    )
                  ? queryParams.optionalKeysLookup.tab
                  : queryParams.optionalKeysLookup.tab === "sharing" &&
                      sharedWith !== "ACCESS_DENIED"
                    ? "sharing"
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
              ...(sharedWith !== "ACCESS_DENIED"
                ? [
                    {
                      id: "sharing",
                      displayName: "Sharing",
                      content: (
                        <SharingTab
                          activityCollectionId={id}
                          sharedWith={sharedWith}
                          refetch={refetch}
                        />
                      ),
                    },
                  ]
                : []),
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

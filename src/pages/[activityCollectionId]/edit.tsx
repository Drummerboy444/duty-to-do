import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { useSafeActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import * as Tabs from "@radix-ui/react-tabs";
import { type ReactNode } from "react";
import { Separator } from "~/components/Separator";
import { PageHeader } from "~/components/PageHeader";
import { IconButton } from "~/components/IconButton";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { CreateTagButton } from "~/components/TagForm/CreateTagButton";
import { getTagColour } from "~/utils/string-to-colour";

const TagsEditorRow = ({ tag }: { tag: { id: string; name: string } }) => {
  return (
    <div className="flex gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-500">
      <p
        style={{
          backgroundColor: getTagColour(tag.id),
        }}
        className="rounded-full px-4 text-black"
      >
        {tag.name}
      </p>
      <div className="grow" />
      <IconButton icon={<TrashIcon />} warn />
      <IconButton icon={<Pencil1Icon />} />
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
        <TagsEditorRow key={tag.id} tag={tag} />
      ))}
    </div>
  );
};

const EditPageTabs = ({
  tabs,
}: {
  tabs: { id: string; displayName: string; content: ReactNode }[];
}) => {
  const firstTab = tabs[0];

  if (firstTab === undefined) return undefined;

  return (
    <Tabs.Root defaultValue={firstTab.id} className="flex flex-col gap-2">
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
  const queryParams = useSafeActivityCollectionQueryParams();

  const {
    data: activityCollectionData,
    isLoading: isLoadingActivityCollection,
    refetch: refetchActivityCollection,
  } = api.activityCollections.get.useQuery(
    queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE"
      ? { id: queryParams.activityCollectionId }
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
        <ErrorPage message="You do not have permission to edit this activity collection" />
      );
    }

    case "SUCCESS": {
      const {
        activityCollection: { id, name, description, tags },
      } = activityCollectionData;

      const refetch = async () => {
        await refetchActivityCollection();
      };

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <PageHeader header={name} subheader={description} />
          <EditPageTabs
            tabs={[
              {
                id: "activities",
                displayName: "Activities",
                content: (
                  <p>This is where you will be able to edit activities...</p>
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

import { CreateActivityCollectionButton } from "~/components/ActivityCollectionForm/CreateActivityCollectionButton";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ActivityCollectionCard = ({
  activityCollection: { name, description, createdAt },
}: {
  activityCollection: {
    name: string;
    description: string;
    createdAt: Date;
  };
}) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-300 p-4 hover:cursor-pointer hover:border-black dark:border-gray-500 dark:hover:border-white">
      <h2 className="pb-4 text-xl">{name}</h2>
      <p className="pb-2">{description}</p>
      <div className="grow" />
      <div className="flex justify-end">
        <div className="text-sm text-gray-500">
          Created {dayjs(createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

const ActivityCollectionGrid = ({
  activityCollections,
}: {
  activityCollections: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activityCollections.map((activityCollection) => (
        <ActivityCollectionCard
          key={activityCollection.id}
          activityCollection={activityCollection}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const {
    data: activityCollectionsData,
    isLoading: isLoadingActivityCollections,
    refetch: refetchActivityCollections,
  } = api.activityCollection.getAll.useQuery();

  if (isLoadingActivityCollections) return <LoadingPage />;

  if (activityCollectionsData === undefined)
    return (
      <ErrorPage message="We couldn't find your activity collections, please try again later" />
    );

  const { activityCollections } = activityCollectionsData;

  return (
    <main className="flex flex-col gap-4 px-24 py-12">
      <div>
        <CreateActivityCollectionButton
          refetch={async () => {
            await refetchActivityCollections();
          }}
        />
      </div>
      <ActivityCollectionGrid activityCollections={activityCollections} />
    </main>
  );
}

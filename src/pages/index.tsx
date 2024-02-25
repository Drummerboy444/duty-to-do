import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CreateActivityCollectionButton } from "~/components/ActivityCollectionForm/CreateActivityCollectionButton";
import { EditActivityCollectionButton } from "~/components/ActivityCollectionForm/EditActivityCollectionButton";
import { DeleteActivityCollectionButton } from "~/components/DeleteActivityCollectionButton";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";

dayjs.extend(relativeTime);

const ActivityCollectionCard = ({
  activityCollection: { id, name, description, createdAt },
  refetch,
}: {
  activityCollection: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  };
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-300 p-4 hover:cursor-pointer hover:border-black dark:border-gray-500 dark:hover:border-white">
      <div className="flex gap-2 pb-4">
        <h2 className="flex-1 text-xl">{name}</h2>
        <div>
          <DeleteActivityCollectionButton
            activityCollectionId={id}
            refetch={refetch}
          />
        </div>
        <div>
          <EditActivityCollectionButton
            activityCollectionId={id}
            defaultValues={{ name, description }}
            refetch={refetch}
          />
        </div>
      </div>

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
  refetch,
}: {
  activityCollections: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }[];
  refetch: () => Promise<void>;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activityCollections.map((activityCollection) => (
        <ActivityCollectionCard
          key={activityCollection.id}
          activityCollection={activityCollection}
          refetch={refetch}
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
    <main className="flex flex-col gap-4 px-8 py-12  sm:px-16 lg:px-24">
      <div>
        <CreateActivityCollectionButton
          refetch={async () => {
            await refetchActivityCollections();
          }}
        />
      </div>
      <ActivityCollectionGrid
        activityCollections={activityCollections}
        refetch={async () => {
          await refetchActivityCollections();
        }}
      />
    </main>
  );
}

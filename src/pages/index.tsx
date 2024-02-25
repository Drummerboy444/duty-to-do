import { CreateActivityCollectionButton } from "~/components/ActivityCollectionForm/CreateActivityCollectionButton";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// const ActivityCollectionCard = ({}: {
//   name: string;
//   description: string;
//   createdAt: string;
// }) => {

// };

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
      {activityCollections.map((activityCollection) => (
        <div key={activityCollection.id}>
          <div>Name: {activityCollection.name}</div>
          <div>Description: {activityCollection.description}</div>
          <div>Created: {dayjs(activityCollection.createdAt).fromNow()}</div>
        </div>
      ))}
    </main>
  );
}

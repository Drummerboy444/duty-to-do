import { CreateActivityCollectionButton } from "~/components/ActivityCollectionForm/CreateActivityCollectionButton";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";

export default function HomePage() {
  const {
    data: activityCollectionsData,
    isLoading: isLoadingActivityCollections,
    refetch: refetchActivityCollections,
  } = api.activityCollection.getAll.useQuery();

  if (isLoadingActivityCollections) return <LoadingPage />;

  if (activityCollectionsData === undefined)
    return <div>Something went wrong...</div>;

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
          <div>
            Created at: {activityCollection.createdAt.toLocaleTimeString()}{" "}
            {activityCollection.createdAt.toLocaleDateString()}
          </div>
        </div>
      ))}
    </main>
  );
}

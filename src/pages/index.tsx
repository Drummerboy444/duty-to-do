import { api } from "~/utils/api";

export default function Home() {
  const {
    data: activityCollectionsData,
    isLoading: isLoadingActivityCollections,
  } = api.activityCollection.getAll.useQuery();

  if (isLoadingActivityCollections) return <div>Loading...</div>;

  if (activityCollectionsData === undefined)
    return <div>Something went wrong...</div>;

  const { activityCollections } = activityCollectionsData;

  return (
    <main>
      <div>Start</div>
      <div className="h-48">box1</div>
      <div className="h-48">box</div>
      <div className="h-48">box</div>
      <div className="h-48">box</div>
      <div className="h-48">box</div>
      {activityCollections.map((activityCollection) => (
        <div key={activityCollection.id}>Name: {activityCollection.name}</div>
      ))}
    </main>
  );
}

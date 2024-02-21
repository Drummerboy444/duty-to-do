import { UserButton } from "@clerk/nextjs";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[rgb(172,143,212)] to-[#464dcb]">
      <h1>This is a Header</h1>
      <UserButton afterSignOutUrl="/" />
      {activityCollections.map((activityCollection) => (
        <div key={activityCollection.id}>Name: {activityCollection.name}</div>
      ))}
    </main>
  );
}

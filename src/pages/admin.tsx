import { useUser } from "@clerk/nextjs";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";
import { isAdmin } from "~/utils/is-admin";

const AdminCard = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="flex justify-between gap-2 rounded-xl border border-gray-300 p-4 dark:border-gray-500">
      <div>{name}:</div>
      <div>{value}</div>
    </div>
  );
};

export default function AdminPage() {
  const { user, isLoaded: userIsLoaded } = useUser();

  const { data: statisticsData, isLoading: isLoadingStatistics } =
    api.admin.statistics.useQuery(undefined, {
      enabled: userIsLoaded && user !== null && isAdmin(user.publicMetadata),
    });

  if (!userIsLoaded) return <LoadingPage />;

  const userIsAdmin = user !== null && isAdmin(user.publicMetadata);

  if (!userIsAdmin)
    return <ErrorPage message="You really shouldn't be here..." />;

  if (isLoadingStatistics) return <LoadingPage />;

  if (statisticsData === undefined)
    return <ErrorPage message="Error fetching statistics" />;

  return (
    <main className="px-8 py-12 sm:px-16 lg:px-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminCard name="Users" value={statisticsData.userCount.toString()} />
        <AdminCard
          name="Activity collections"
          value={statisticsData.activityCollectionCount.toString()}
        />
        <AdminCard
          name="Activities"
          value={statisticsData.activityCount.toString()}
        />
        <AdminCard name="Tags" value={statisticsData.tagCount.toString()} />
      </div>
    </main>
  );
}

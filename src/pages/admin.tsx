import { useUser } from "@clerk/nextjs";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { api } from "~/utils/api";
import { isAdmin } from "~/utils/is-admin";

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
    <div>
      This is the admin page. Here are some statistics: {statisticsData}
    </div>
  );
}

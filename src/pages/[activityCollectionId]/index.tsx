import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { useSafeActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";
import { getActivityCollectionEditRoute } from "~/utils/routing";

export default function ActivityCollectionPage() {
  const queryParams = useSafeActivityCollectionQueryParams();

  const {
    data: activityCollectionData,
    isLoading: isLoadingActivityCollection,
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
        <ErrorPage message="You do not have permission to view this activity collection" />
      );
    }

    case "SUCCESS": {
      const {
        activityCollection: { id, name, description, activities },
      } = activityCollectionData;

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <h1 className="text-4xl">{name}</h1>
          <p>{description}</p>
          <Link href={getActivityCollectionEditRoute(id)}>
            <Pencil1Icon />
          </Link>
          {activities.length > 0 ? (
            <div>
              {activities.map((activity) => (
                <p key={activity.id}>{activity.name}</p>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">
              You don&apos;t have any activities in this collection, try
              creating one!
            </p>
          )}
        </main>
      );
    }

    default: {
      absurd(activityCollectionData);
    }
  }
}

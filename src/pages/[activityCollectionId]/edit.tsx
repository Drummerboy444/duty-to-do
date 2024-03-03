import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { useSafeActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";

export default function EditActivityCollectionPage() {
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
        <ErrorPage message="You do not have permission to edit this activity collection" />
      );
    }

    case "SUCCESS": {
      const {
        activityCollection: { name },
      } = activityCollectionData;

      return (
        <main className="flex flex-col gap-4 px-8 py-12 sm:px-16 lg:px-24">
          <h1 className="text-4xl">{name} edit page</h1>
          <p>This is where you can edit things...</p>
        </main>
      );
    }

    default: {
      absurd(activityCollectionData);
    }
  }
}

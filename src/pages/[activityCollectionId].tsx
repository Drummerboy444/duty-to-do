import { ErrorPage } from "~/components/ErrorPage";
import { LoadingPage } from "~/components/LoadingPage";
import { useSaveActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import { absurd } from "~/utils/absurd";
import { api } from "~/utils/api";

export default function ActivityCollectionPage() {
  const queryParams = useSaveActivityCollectionQueryParams();

  const {
    data: activityCollectionData,
    isLoading: isLoadingActivityCollection,
  } = api.activityCollection.get.useQuery(
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
        activityCollection: { name, description },
      } = activityCollectionData;

      return (
        <main className="px-8 py-12 sm:px-16 lg:px-24">
          <h1 className="pb-4 text-4xl">{name}</h1>
          <p>{description}</p>
        </main>
      );
    }

    default: {
      absurd(activityCollectionData);
    }
  }
}

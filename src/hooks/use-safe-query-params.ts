import { useRouter } from "next/router";

const getSafeQueryParamsHook =
  <T extends string>(keys: T[]) =>
  () => {
    const { query, isReady } = useRouter();

    if (!isReady) return "LOADING";

    if (keys.some((key) => typeof query[key] !== "string"))
      return "QUERY_PARAMS_UNAVAILABLE";

    return keys.reduce(
      (previousLookup, key) => ({
        ...previousLookup,
        [key]: query[key],
      }),
      {} as Record<T, string>,
    );
  };

export const useSaveActivityCollectionQueryParams = getSafeQueryParamsHook([
  "activityCollectionId",
]);

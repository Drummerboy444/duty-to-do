import { useRouter } from "next/router";

export const getSafeQueryParamsHook =
  <RequiredKeys extends string, OptionalKeys extends string>(
    requiredKeys: RequiredKeys[],
    optionalKeys: OptionalKeys[] = [],
  ) =>
  () => {
    const { query, isReady } = useRouter();

    if (!isReady) return "LOADING";

    if (requiredKeys.some((key) => typeof query[key] !== "string"))
      return "QUERY_PARAMS_UNAVAILABLE";

    const requiredKeysLookup = requiredKeys.reduce(
      (previousLookup, key) => ({
        ...previousLookup,
        [key]: query[key],
      }),
      {} as Record<RequiredKeys, string>,
    );

    const optionalKeysLookup = optionalKeys.reduce(
      (previousLookup, key) => ({
        ...previousLookup,
        [key]: query[key],
      }),
      {} as Record<OptionalKeys, string | undefined>,
    );

    return { requiredKeysLookup, optionalKeysLookup };
  };

export const useSafeActivityCollectionQueryParams = getSafeQueryParamsHook([
  "activityCollectionId",
]);

export const useSafeEditActivityCollectionQueryParams = getSafeQueryParamsHook(
  ["activityCollectionId"],
  ["tab"],
);

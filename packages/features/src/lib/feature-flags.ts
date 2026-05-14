export const FEATURE_FLAGS = {
  liveoktDummyData: {
    key: "liveokt.dummyData",
    label: "Dummy-data i liveokt",
    description:
      "Viser flytende popover for å legge til 10 dummy-elever og trigge dummy-stemmer i lærervisningen av liveokt. Dummy-data slettes automatisk når økten avsluttes.",
  },
} as const;

export type FeatureFlagDefinition = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
export type FeatureFlagKey = FeatureFlagDefinition["key"];

export const FEATURE_FLAG_LIST: ReadonlyArray<FeatureFlagDefinition> = Object.values(FEATURE_FLAGS);

export const FEATURE_FLAG_KEYS: ReadonlyArray<FeatureFlagKey> = FEATURE_FLAG_LIST.map((f) => f.key);

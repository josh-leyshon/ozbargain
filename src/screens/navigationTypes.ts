import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type FeedScreenParamList = undefined;

type DealInfoScreenParamList = {
  deal: {
    title: string;
    description: string;
    imageUrl?: string;
    id: number;
  };
};

// All routes (screens) and their params
export type RootStackParamList = {
  Feed: FeedScreenParamList;
  DealInfo: DealInfoScreenParamList;
};

export type FeedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Feed"
>;

export type DealInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "DealInfo"
>;

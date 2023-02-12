import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { OzbargainFeed } from "../feed-parser/parser";

type FeedScreenParamList = undefined;

type DealInfoScreenParamList = {
  dealId: OzbargainFeed["deals"][number]["id"];
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

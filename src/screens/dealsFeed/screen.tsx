import { DealsFeed } from "./dealsFeed";
import type { FeedScreenProps } from "../navigationTypes";
import { useFeed } from "../../global-state/dealsFeed";
import { StyleSheet } from "react-native";

export function FeedScreen({ navigation }: FeedScreenProps): JSX.Element {
  const deals = useFeed().getDeals();

  return (
    <DealsFeed
      style={styles.container}
      items={deals.map((deal) => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        imageUrl: deal.thumbnailUrl,
      }))}
      onPressItem={(item) =>
        navigation.navigate("DealInfo", { dealId: item.id })
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

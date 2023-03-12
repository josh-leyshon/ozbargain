import { FlatList, StyleSheet, View, type FlatListProps } from "react-native";
import { DealCard, type DealCardProps } from "./dealCard/dealCard";
import type { OzbargainFeed } from "../../feed-parser/parser";

type DealId = { id: OzbargainFeed["deals"][number]["id"] };
type DealInfo = Omit<DealCardProps, "onPress">;
type DealItemData = DealInfo & DealId;

export type DealsFeedProps = {
  items: DealItemData[];
  onPressItem: (item: DealItemData) => void;
  style?: FlatListProps<DealItemData>["contentContainerStyle"];
};

export function DealsFeed(props: DealsFeedProps): JSX.Element {
  return (
    <FlatList
      data={props.items}
      renderItem={({ item }) => (
        <DealCard
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          onPress={() => props.onPressItem(item)}
          key={item.id}
        />
      )}
      ItemSeparatorComponent={FeedItemSeparator}
      contentContainerStyle={props.style}
    />
  );
}

function FeedItemSeparator(): JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    padding: 4,
  },
});

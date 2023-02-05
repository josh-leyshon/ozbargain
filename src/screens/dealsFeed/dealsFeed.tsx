import { FlatList, StyleSheet, View } from "react-native";
import { DealCard, type DealCardProps } from "./dealCard/dealCard";
import type { OzbargainFeed } from "../../feed-parser/parser";

export type DealsFeedProps = {
  items: (DealCardProps & { id: OzbargainFeed["deals"][number]["id"] })[];
};

export function DealsFeed(props: DealsFeedProps): JSX.Element {
  return (
    <FlatList
      style={styles.list}
      data={props.items}
      renderItem={({ item }) => (
        <DealCard
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          key={item.id}
        />
      )}
      ItemSeparatorComponent={FeedItemSeparator}
    />
  );
}

function FeedItemSeparator(): JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  list: {},
  separator: {
    padding: 4,
  },
});

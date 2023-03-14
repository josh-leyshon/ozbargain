import { FlatList, StyleSheet, View } from 'react-native';
import type { FlatListProps } from 'react-native';
import { DealCard } from './dealCard/dealCard';
import type { DealCardProps } from './dealCard/dealCard';
import type { OzbargainFeed } from '../../feed-parser/parser';

type DealId = {
  id: OzbargainFeed['deals'][number]['id'];
};
type DealInfo = Omit<DealCardProps, 'onPress'>;
type DealItemData = DealInfo & DealId;

export type DealsFeedProps = {
  items: DealItemData[];
  onPressItem: (item: DealItemData) => void;
  style?: FlatListProps<DealItemData>['contentContainerStyle'];
};

export function DealsFeed({
  items,
  onPressItem,
  style,
}: DealsFeedProps): JSX.Element {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <DealCard
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          onPress={() => onPressItem(item)}
          key={item.id}
        />
      )}
      ItemSeparatorComponent={FeedItemSeparator}
      contentContainerStyle={style}
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
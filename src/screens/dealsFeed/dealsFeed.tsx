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
  onRefresh: NonNullable<FlatListProps<DealItemData>['onRefresh']>;
  loadNextPage: () => void;
  refreshing: NonNullable<FlatListProps<DealItemData>['refreshing']>;
  style?: FlatListProps<DealItemData>['contentContainerStyle'];
};

export function DealsFeed({
  items,
  onPressItem,
  onRefresh,
  loadNextPage,
  refreshing,
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
      onRefresh={onRefresh}
      onEndReached={() => loadNextPage()}
      // This value felt about right, with new deals being fetched a little before reaching the end.
      // After manual testing, couldn't figure out exactly how this value relates to how many deals are on screen.
      // So this number might need to change if the size of deal cards changes.
      onEndReachedThreshold={3}
      refreshing={refreshing}
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

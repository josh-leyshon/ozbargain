import { FlatList, StyleSheet, View } from 'react-native';
import type { FlatListProps } from 'react-native';
import { sizes } from '../../base/constants/sizes';
import type { Deal } from '../../global-state/dealsFeed';
import { DealCard } from './dealCard/dealCard';
import { DealMeta, makeDefaultExpiryFormatter } from './dealCard/dealMeta';

export type DealsFeedProps = {
  deals: Deal[];
  onPressItem: (item: Deal) => void;
  onRefresh: NonNullable<FlatListProps<Deal>['onRefresh']>;
  loadNextPage: () => void;
  refreshing: NonNullable<FlatListProps<Deal>['refreshing']>;
  style?: FlatListProps<Deal>['contentContainerStyle'];
};

export function DealsFeed({
  deals,
  onPressItem,
  onRefresh,
  loadNextPage,
  refreshing,
  style,
}: DealsFeedProps): React.JSX.Element {
  return (
    <FlatList
      data={deals}
      renderItem={({ item: deal }) => (
        <DealCard
          key={deal.id}
          title={deal.title}
          dealMeta={<DealMeta {...deal} expiryFormatter={makeDefaultExpiryFormatter(new Date())} />}
          imageUrl={deal.thumbnailUrl}
          onPress={() => onPressItem(deal)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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

const styles = StyleSheet.create({
  separator: {
    padding: sizes.small,
  },
});

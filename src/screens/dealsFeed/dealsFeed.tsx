import type React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import type { FlatListProps } from 'react-native';
import { Card } from '../../base/components/card/card';
import { sizes } from '../../base/constants/sizes';
import type { Deal } from '../../feed-parser/parser';
import { DealCardInfo } from './dealCard/dealCard';
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
        <Pressable onPress={() => onPressItem(deal)} key={deal.id}>
          <Card padding='large'>
            <DealCardInfo
              title={deal.title.text}
              imageUrl={deal.thumbnailUrl}
              dealMeta={<DealMeta {...deal} expiryFormatter={makeDefaultExpiryFormatter(new Date())} />}
            />
          </Card>
        </Pressable>
      )}
      ItemSeparatorComponent={EmptyGap}
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

function EmptyGap(): React.JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    padding: sizes.small,
  },
});

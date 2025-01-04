import React from 'react';
import { StyleSheet } from 'react-native';
import { useDealsFeed } from '../../global-state/dealsFeed';
import type { FeedScreenProps } from '../navigationTypes';
import { DealsFeed } from './dealsFeed';

export function FeedScreen({ navigation }: FeedScreenProps): React.JSX.Element {
  const { state, dealsFeed, refresh, loadNextPage } = useDealsFeed();

  return (
    <DealsFeed
      style={styles.container}
      deals={dealsFeed?.getDeals() ?? []}
      onPressItem={item => navigation.navigate('DealInfo', { dealId: item.id })}
      onRefresh={refresh}
      loadNextPage={() => state === 'ready' ? loadNextPage(dealsFeed) : undefined}
      refreshing={state === 'refreshing'}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

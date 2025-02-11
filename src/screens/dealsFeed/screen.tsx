import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { colours } from '../../base/constants/colours';
import { sizes } from '../../base/constants/sizes';
import { useDealsFeed } from '../../global-state/dealsFeed';
import type { FeedScreenProps } from '../navigationRoutes';
import { DealsFeed } from './dealsFeed';

export function FeedScreen({ route }: FeedScreenProps): React.JSX.Element {
  const navigation = useNavigation();
  const {
    state,
    dealsFeed,
    refreshTopDeals,
    refreshNewDeals,
    loadTopDealsNextPage,
    loadNewDealsNextPage,
  } = useDealsFeed();

  const { feedType } = route.params;

  const getDeals = feedType === 'top'
    ? () => dealsFeed.getTopDeals()
    : () => dealsFeed.getNewDeals();
  const refreshDeals = feedType === 'top'
    ? refreshTopDeals
    : refreshNewDeals;
  const loadNextPage = feedType === 'top'
    ? loadTopDealsNextPage
    : loadNewDealsNextPage;

  return (
    <DealsFeed
      style={styles.container}
      deals={getDeals()}
      onPressItem={item => navigation.navigate('DealInfo', { dealId: item.id })}
      onRefresh={refreshDeals}
      loadNextPage={() => state === 'ready' ? loadNextPage() : undefined}
      refreshing={state === 'refreshing'}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.medium,
    backgroundColor: colours.background,
  },
});

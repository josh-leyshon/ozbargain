import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { colours } from '../../base/constants/colours';
import { sizes } from '../../base/constants/sizes';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { DealsFeed } from './dealsFeed';

export function FeedScreen(): React.JSX.Element {
  const navigation = useNavigation();
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
    padding: sizes.medium,
    backgroundColor: colours.background,
  },
});

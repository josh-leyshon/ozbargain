import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colours } from '../../base/constants/colours';
import { sizes } from '../../base/constants/sizes';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { DealsFeed } from './dealsFeed';

export function FeedScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { state, dealsFeed, refreshNewDeals, loadNewDealsNextPage } = useDealsFeed();

  return (
    <DealsFeed
      style={[styles.container, {
        paddingBlockStart: insets.top + sizes.medium,
      }]}
      deals={dealsFeed?.getNewDeals() ?? []}
      onPressItem={item => navigation.navigate('DealInfo', { dealId: item.id })}
      onRefresh={refreshNewDeals}
      loadNextPage={() => state === 'ready' ? loadNewDealsNextPage() : undefined}
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

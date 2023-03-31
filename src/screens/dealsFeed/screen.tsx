import { Platform, StyleSheet } from 'react-native';
import { DealsFeed } from './dealsFeed';
import type { FeedScreenProps } from '../navigationTypes';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { Button } from '../../base/components/button/button';

export function FeedScreen({ navigation }: FeedScreenProps): JSX.Element {
  const { state, dealsFeed, refresh, loadNextPage } = useDealsFeed();

  return (
    <>
      {Platform.OS === 'web' && (
        <Button title="Pull to refresh" onPress={refresh} color="green" />
      )}
      <DealsFeed
        style={styles.container}
        items={
          dealsFeed?.getDeals().map(deal => ({
            id: deal.id,
            title: deal.title,
            description: deal.description,
            imageUrl: deal.thumbnailUrl,
          })) ?? []
        }
        onPressItem={item =>
          navigation.navigate('DealInfo', { dealId: item.id })
        }
        onRefresh={refresh}
        loadNextPage={() =>
          state === 'ready' ? loadNextPage(dealsFeed) : undefined
        }
        refreshing={state === 'refreshing'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

import { openURL } from 'expo-linking';
import type React from 'react';
import { Platform, ScrollView, Share, StyleSheet } from 'react-native';
import { Card } from '../../base/components/card/card';
import { Text } from '../../base/components/text/text';
import { sizes } from '../../base/constants/sizes';
import { Column } from '../../base/layout/flex';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { DealCardInfo } from '../dealsFeed/dealCard/dealCard';
import { DealMeta, makeDefaultExpiryFormatter } from '../dealsFeed/dealCard/dealMeta';
import type { DealInfoScreenProps } from '../navigationTypes';
import { LinkButtons } from './linkButtons';

async function openLink(url: string): Promise<void> {
  await openURL(url).catch(() => console.log('User cancelled dialog'));
}

function shareWeb(): void {
  console.warn('Sharing is not available on web');
}

export function DealInfoScreen({ route }: DealInfoScreenProps): React.JSX.Element {
  const { dealId } = route.params;
  const { dealsFeed } = useDealsFeed();

  if (!dealsFeed) {
    throw new Error(
      'Opened DealInfo Screen but dealsFeed is not available. Unable to retrieve deal information.',
    );
  }

  const deal = dealsFeed.getDealById(dealId);

  const onPressShare = Platform.OS === 'web' ? shareWeb : async () => {
    await Share.share({ message: deal.links.deal });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Column gap='medium'>
        <Card gap='large' padding='large'>
          <DealCardInfo
            title={deal.title.text}
            imageUrl={deal.thumbnailUrl}
            dealMeta={<DealMeta {...deal} expiryFormatter={makeDefaultExpiryFormatter(new Date())} />}
          />
          <LinkButtons
            onPressGoToDeal={() => openLink(deal.links.productPage)}
            onPressOpenOnOzbargain={() => openLink(deal.links.deal)}
            onPressShare={onPressShare}
          />
        </Card>
        <Card padding='large'>
          <Text>{deal.description}</Text>
        </Card>
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.medium,
  },
});

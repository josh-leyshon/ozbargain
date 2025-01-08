import { openURL } from 'expo-linking';
import { Platform, ScrollView, Share, StyleSheet } from 'react-native';
import { sizes } from '../../base/constants/sizes';
import { Column } from '../../base/layout/flex';
import { useDealsFeed } from '../../global-state/dealsFeed';
import type { DealInfoScreenProps } from '../navigationTypes';
import { DealHeader } from './dealHeader';
import { Description } from './description';
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
      <Column gap='large'>
        <DealHeader {...deal} />
        <LinkButtons
          onPressGoToDeal={() => openLink(deal.links.productPage)}
          onPressOpenOnOzbargain={() => openLink(deal.links.deal)}
          onPressShare={onPressShare}
        />
        <Description description={deal.description} />
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.large,
  },
});

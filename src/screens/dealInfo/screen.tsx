import { openURL } from 'expo-linking';
import { ScrollView, Share, StyleSheet } from 'react-native';
import { Column } from '../../base/layout/flex';
import { useDealsFeed } from '../../global-state/dealsFeed';
import type { DealInfoScreenProps } from '../navigationTypes';
import { DealHeader } from './dealHeader';
import { Description } from './description';
import { LinkButtons } from './linkButtons';

export function DealInfoScreen({ route }: DealInfoScreenProps): React.JSX.Element {
  const { dealId } = route.params;
  const { dealsFeed } = useDealsFeed();

  if (!dealsFeed) {
    throw new Error(
      'Opened DealInfo Screen but dealsFeed is not available. Unable to retrieve deal information.',
    );
  }

  const {
    title,
    description,
    author,
    thumbnailUrl,
    postedAt,
    expiresAt,
    votes,
    links,
  } = dealsFeed.getDealById(dealId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Column gap={16}>
        <DealHeader
          title={title}
          imageUrl={thumbnailUrl}
          author={author}
          postedAt={postedAt}
          expiresAt={expiresAt}
          votes={votes}
        />
        <LinkButtons
          onPressGoToDeal={() => openLink(links.productPage)}
          onPressOpenOnOzbargain={() => openLink(links.deal)}
          onPressShare={async () => {
            await Share.share({ message: links.deal });
          }}
        />
        <Description description={description} />
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

async function openLink(url: string): Promise<void> {
  await openURL(url).catch(() => console.log('User cancelled dialog'));
}

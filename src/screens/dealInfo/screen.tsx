import { openURL } from 'expo-linking';
import { ScrollView, Share, StyleSheet } from 'react-native';
import type { DealInfoScreenProps } from '../navigationTypes';
import { DealHeader } from './dealHeader';
import { LinkButtons } from './linkButtons';
import { Description } from './description';
import { Column } from '../../base/layout/flex';
import { useFeed } from '../../global-state/dealsFeed';

export function DealInfoScreen({ route }: DealInfoScreenProps): JSX.Element {
  const { dealId } = route.params;
  const {
    title,
    description,
    author,
    thumbnailUrl,
    postedAt,
    expiresAt,
    votes,
    links,
  } = useFeed().getDealById(dealId);

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

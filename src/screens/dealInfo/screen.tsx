import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, Share, StyleSheet } from 'react-native';
import { Card } from '../../base/components/card/card';
import { Spinner } from '../../base/components/spinner/spinner';
import { Text } from '../../base/components/text/text';
import { colours } from '../../base/constants/colours';
import { sizes } from '../../base/constants/sizes';
import { useFetch } from '../../base/hooks/useFetch';
import { Column } from '../../base/layout/flex';
import { openLink } from '../../base/links/openLink';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { getDealCommentsFromDocument } from '../../parsers/web-scrape/deal-info-page/comments';
import { DealCardInfo } from '../dealsFeed/dealCard/dealCard';
import { DealMeta, makeDefaultExpiryFormatter } from '../dealsFeed/dealCard/dealMeta';
import type { DealInfoScreenProps } from '../navigationRoutes';
import { CommentThread } from './comments/comments';
import { LinkButtons } from './linkButtons';
import { Description } from './renderDescription';

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

  const { data: dealInfoHtml } = useFetch(deal.links.deal);
  const comments = dealInfoHtml ? getDealCommentsFromDocument(dealInfoHtml) : undefined;

  const onPressShare = Platform.OS === 'web' ? shareWeb : async () => {
    await Share.share({ message: deal.links.deal });
  };

  return (
    <>
      <StatusBar backgroundColor={colours.foreground} />
      <ScrollView contentContainerStyle={styles.container}>
        <Column gap='medium'>
          <Card gap='large' padding='large'>
            <DealCardInfo
              title={deal.title}
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
            <Description description={deal.description} />
          </Card>
          <Card padding='large' gap='large'>
            {comments?.map(comment => (
              <React.Fragment key={comment.id}>
                <Text weight='bold' colour='primaryDark'>Thread</Text>
                <CommentThread comment={comment} />
              </React.Fragment>
            )) ?? <Spinner />}
          </Card>
        </Column>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: sizes.medium,
  },
});

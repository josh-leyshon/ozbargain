import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, Share, StyleSheet } from 'react-native';
import { Card } from '../../base/components/card/card';
import { Spinner } from '../../base/components/spinner/spinner';
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
async function shareMobile(link: string) {
  await Share.share({ message: link });
}

const onPressShare = Platform.OS === 'web' ? shareWeb : shareMobile;

export function DealInfoScreen({ route }: DealInfoScreenProps): React.JSX.Element {
  const { dealId } = route.params;
  const { dealsFeed } = useDealsFeed();

  const deal = dealsFeed.getDealById(dealId);

  const { data: dealInfoHtml } = useFetch(deal.links.deal);
  const comments = dealInfoHtml ? getDealCommentsFromDocument(dealInfoHtml) : undefined;

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
              onPressShare={() => onPressShare(deal.links.deal)}
            />
          </Card>
          <Card padding='large'>
            <Description description={deal.description} />
          </Card>
          {comments?.map(comment => (
            <Card padding='large' key={comment.id}>
              <CommentThread comment={comment} />
            </Card>
          )) ?? <Spinner />}
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

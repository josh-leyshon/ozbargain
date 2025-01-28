import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from '../../base/components/card/card';
import { Loading } from '../../base/components/loading/loading';
import { Text } from '../../base/components/text/text';
import { colours } from '../../base/constants/colours';
import { sizes } from '../../base/constants/sizes';
import { useFetch } from '../../base/hooks/useFetch';
import { Column } from '../../base/layout/flex';
import { openLink } from '../../base/links/openLink';
import { share } from '../../base/links/share';
import { useDealsFeed } from '../../global-state/dealsFeed';
import { getDealCommentsFromDocument } from '../../parsers/web-scrape/deal-info-page/comments';
import { DealCardInfo } from '../dealsFeed/dealCard/dealCard';
import { DealMeta, makeDefaultExpiryFormatter } from '../dealsFeed/dealCard/dealMeta';
import type { DealInfoScreenProps } from '../navigationRoutes';
import { CommentThread } from './comments/commentThread';
import { Description } from './description';
import { LinkButtons } from './linkButtons';

export function DealInfoScreen({ route }: DealInfoScreenProps): React.JSX.Element {
  const { dealId } = route.params;
  const { dealsFeed } = useDealsFeed();

  const deal = dealsFeed.getDealById(dealId);

  const { data: dealInfoHtml, error } = useFetch(deal.links.deal);
  const comments = dealInfoHtml ? getDealCommentsFromDocument(dealInfoHtml) : undefined;

  if (error) {
    console.error('Error fetching deal info page:', error);
  }

  const renderedComments = error != null
    ? <Text colour='light'>Something went wrong.</Text>
    : comments == null
    ? <Loading />
    : comments.length < 1
    ? <Text colour='light'>No comments</Text>
    : comments.map(comment => <CommentThread key={comment.id} firstComment={comment} />);

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
              onPressShare={() => share({ message: deal.links.deal })}
            />
          </Card>
          <Card padding='large'>
            <Description description={deal.description} />
          </Card>
          <Card padding='large' gap='large'>
            <Text size='large' weight='bold'>Comments</Text>
            <Column gap='medium'>
              {renderedComments}
            </Column>
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

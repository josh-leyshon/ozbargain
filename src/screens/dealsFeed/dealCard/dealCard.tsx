import Icon from '@expo/vector-icons/MaterialIcons';
import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Tag, type TagProps } from '../../../base/components/tag/tag';
import { Text } from '../../../base/components/text/text';
import { colours } from '../../../base/constants/colours';
import { sizes } from '../../../base/constants/sizes';
import { fontSizes } from '../../../base/constants/text';
import { Column, Row } from '../../../base/layout/flex';
import { getVotesIntensity } from '../../../base/votes/votesIntensity';
import type { Deal } from '../../../global-state/dealsFeed';

export const DEAL_CARD_TEST_ID = 'DEAL_CARD';

export type DealCardProps = {
  title: string;
  dealMeta: ReactNode;
  imageUrl?: string;
  onPress: () => void;
};

export function DealCard({
  title,
  dealMeta,
  imageUrl,
  onPress,
}: DealCardProps): React.JSX.Element {
  const minHeight = cardMinHeightPx;

  return (
    <Pressable onPress={onPress} testID={DEAL_CARD_TEST_ID}>
      <Column justifyContent='space-between' gap='medium' padding='large' style={[styles.card, { minHeight }]}>
        <Text size='large' weight='bold' numberOfLines={12}>
          {title}
        </Text>
        <Row justifyContent='space-between' gap='medium'>
          {dealMeta}
          {imageUrl != null && (
            <SquareImage
              source={{ uri: imageUrl }}
              sizePx={cardImageSizePx}
            />
          )}
        </Row>
      </Column>
    </Pressable>
  );
}

const formatShortDate: Intl.DateTimeFormat['format'] = date =>
  new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);

type DealMetaProps = Pick<Deal, 'author' | 'expiresAt' | 'commentCount' | 'votes'>;

export function DealMeta({ author, expiresAt, commentCount, votes }: DealMetaProps): React.JSX.Element {
  const votesIntensity = getVotesIntensity(votes);
  const positiveVotesColour: TagProps['colour'] = votesIntensity.positive === 'intense' ? 'success' : 'normal';
  const negativeVotesColour: TagProps['colour'] = votesIntensity.negative === 'intense' ? 'error' : 'normal';

  return (
    <Column shrink={1} gap='medium' justifyContent='flex-start' alignItems='flex-start'>
      <Tag icon={<Icon name='alarm' />} colour='primary'>
        {expiresAt ? formatShortDate(expiresAt) : 'Unknown'}
      </Tag>
      <Tag icon={<Icon name='person' size={fontSizes.medium} />} colour='normal'>{author}</Tag>
      <Row gap='medium' justifyContent='flex-start' wrap='wrap'>
        <Tag icon={<Icon name='comment' />} colour='normal'>{commentCount}</Tag>
        <Tag
          icon={<Icon name='thumb-up' color={positiveVotesColour === 'success' ? colours.successContent : undefined} />}
          colour={positiveVotesColour}
        >
          {votes.positive}
        </Tag>
        <Tag icon={<Icon name='thumb-down' />} colour={negativeVotesColour}>{votes.negative}</Tag>
      </Row>
    </Column>
  );
}

const cardImageSizePx = 96;
// Roughly adds enough space for at least a line of text;
const cardMinHeightPx = cardImageSizePx + 32;

const styles = StyleSheet.create({
  card: {
    borderRadius: sizes.medium,
    backgroundColor: colours.foreground,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
});

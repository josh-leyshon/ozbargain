import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colours } from '../../../base/colours/colours';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Tag } from '../../../base/components/tag/tag';
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
      <Column justifyContent='space-between' gap={cardItemGapPx} style={[styles.card, { minHeight }]}>
        <Text style={styles.title} numberOfLines={12}>
          {title}
        </Text>
        <Row justifyContent='space-between' gap={cardItemGapPx}>
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

const formatDate: Intl.DateTimeFormat['format'] = date =>
  new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

type DealMetaProps = Pick<Deal, 'author' | 'expiresAt' | 'commentCount' | 'votes'>;

export function DealMeta({ author, expiresAt, commentCount, votes }: DealMetaProps): React.JSX.Element {
  const votesIntensity = getVotesIntensity(votes);
  const positiveVotesColour = votesIntensity.positive === 'intense' ? 'green' : 'grey';
  const negativeVotesColour = votesIntensity.negative === 'intense' ? 'red' : 'grey';

  return (
    <Column shrink={1} gap={8} justifyContent='flex-start' alignItems='flex-start'>
      <Tag icon={<TempTagEmojiIcon emoji='⏰' />} colour='orange'>{expiresAt ? formatDate(expiresAt) : 'Unknown'}</Tag>
      <Tag icon={<TempTagEmojiIcon emoji='🧑' />} colour='grey'>{author}</Tag>
      <Row gap={8} justifyContent='flex-start' wrap='wrap'>
        <Tag icon={<TempTagEmojiIcon emoji='💬' />} colour='grey'>{commentCount}</Tag>
        <Tag icon={<TempTagEmojiIcon emoji='👍' />} colour={positiveVotesColour}>{votes.positive}</Tag>
        <Tag icon={<TempTagEmojiIcon emoji='👎' />} colour={negativeVotesColour}>{votes.negative}</Tag>
      </Row>
    </Column>
  );
}

// Just so that emojis are properly rendered inside <Text>. Can delete when using actual icons.
const TempTagEmojiIcon = ({ emoji }: { emoji: string }) => (
  <Text
    style={{
      fontSize: 12,
      color: colours.copy,
    }}
  >
    {emoji}
  </Text>
);

const cardImageSizePx = 96;
const cardPaddingPx = 16;
const cardItemGapPx = cardPaddingPx / 2;
// Roughly adds enough space for at least a line of text;
const cardMinHeightPx = cardImageSizePx + 32;

const styles = StyleSheet.create({
  card: {
    padding: cardPaddingPx,
    borderRadius: 8,
    backgroundColor: colours.foreground,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colours.copy,
  },
});

import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Tag } from '../../../base/components/tag/tag';
import { Text } from '../../../base/components/text/text';
import { colours } from '../../../base/constants/colours';
import { sizes } from '../../../base/constants/sizes';
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
  const positiveVotesColour = votesIntensity.positive === 'intense' ? 'green' : 'grey';
  const negativeVotesColour = votesIntensity.negative === 'intense' ? 'red' : 'grey';

  return (
    <Column shrink={1} gap='medium' justifyContent='flex-start' alignItems='flex-start'>
      <Tag icon={<TempTagEmojiIcon emoji='⏰' />} colour='orange'>
        {expiresAt ? formatShortDate(expiresAt) : 'Unknown'}
      </Tag>
      <Tag icon={<TempTagEmojiIcon emoji='🧑' />} colour='grey'>{author}</Tag>
      <Row gap='medium' justifyContent='flex-start' wrap='wrap'>
        <Tag icon={<TempTagEmojiIcon emoji='💬' />} colour='grey'>{commentCount}</Tag>
        <Tag icon={<TempTagEmojiIcon emoji='👍' />} colour={positiveVotesColour}>{votes.positive}</Tag>
        <Tag icon={<TempTagEmojiIcon emoji='👎' />} colour={negativeVotesColour}>{votes.negative}</Tag>
      </Row>
    </Column>
  );
}

// Just so that emojis are properly rendered inside <Text>. Can delete when using actual icons.
const TempTagEmojiIcon = ({ emoji }: { emoji: string }) => (
  <Text size='small'>
    {emoji}
  </Text>
);

const cardImageSizePx = 96;
// Roughly adds enough space for at least a line of text;
const cardMinHeightPx = cardImageSizePx + 32;

const styles = StyleSheet.create({
  card: {
    borderRadius: sizes.medium,
    backgroundColor: colours.foreground,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colours.copy,
  },
});

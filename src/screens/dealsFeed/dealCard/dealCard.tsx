import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Tag } from '../../../base/components/tag/tag';
import { Column, Row } from '../../../base/layout/flex';
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

type DealMetaProps = Pick<Deal, 'author' | 'expiresAt' | 'commentCount'>;

export function DealMeta({ author, expiresAt, commentCount }: DealMetaProps): React.JSX.Element {
  return (
    <Column shrink={1} gap={8} alignItems='flex-start'>
      <Tag icon='⏰' colour='orange'>{expiresAt ? formatDate(expiresAt) : 'Unknown'}</Tag>
      <Tag icon='🧑' colour='white'>{author}</Tag>
      <Row gap={8} justifyContent='flex-start' wrap='wrap'>
        <Tag icon='💬' colour='white'>{commentCount}</Tag>
      </Row>
    </Column>
  );
}

const cardImageSizePx = 96;
const cardPaddingPx = 16;
const cardItemGapPx = cardPaddingPx / 2;
// Roughly adds enough space for at least a line of text;
const cardMinHeightPx = cardImageSizePx + 32;
const white = '#ffffff';

const styles = StyleSheet.create({
  card: {
    padding: cardPaddingPx,
    borderRadius: 8,
    backgroundColor: white,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    flexShrink: 1,
    fontSize: 12,
  },
});

import { Pressable, StyleSheet, Text } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Column, Row } from '../../../base/layout/flex';

export const DEAL_CARD_TEST_ID = 'DEAL_CARD';

export type DealCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  onPress: () => void;
};

export function DealCard({
  description,
  onPress,
  title,
  imageUrl,
}: DealCardProps): React.JSX.Element {
  const minHeight = cardMinHeightPx;

  return (
    <Pressable onPress={onPress} testID={DEAL_CARD_TEST_ID}>
      <Column justifyContent='space-between' gap={cardItemGapPx} style={[styles.card, { minHeight }]}>
        <Text style={styles.title} numberOfLines={12}>
          {title}
        </Text>
        <Row justifyContent='space-between' gap={cardItemGapPx}>
          <Text style={styles.description} numberOfLines={5}>
            {description}
          </Text>
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

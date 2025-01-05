import type React from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Text } from '../../../base/components/text/text';
import { colours } from '../../../base/constants/colours';
import { sizes } from '../../../base/constants/sizes';
import { Column, Row } from '../../../base/layout/flex';

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
        <Row justifyContent='space-between' gap='medium' wrap='wrap'>
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

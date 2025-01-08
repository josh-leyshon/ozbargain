import type React from 'react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Text } from '../../../base/components/text/text';
import { colours } from '../../../base/constants/colours';
import { sizes } from '../../../base/constants/sizes';
import { Column, Row } from '../../../base/layout/flex';

export type DealCardProps = {
  title: string;
  dealMeta: ReactNode;
  imageUrl?: string;
};

export function DealCard({
  title,
  dealMeta,
  imageUrl,
}: DealCardProps): React.JSX.Element {
  return (
    <Column
      justifyContent='space-between'
      gap='medium'
      padding='large'
      style={styles.card}
    >
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
  );
}

const cardImageSizePx = 96;

const styles = StyleSheet.create({
  card: {
    borderRadius: sizes.medium,
    backgroundColor: colours.foreground,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
});

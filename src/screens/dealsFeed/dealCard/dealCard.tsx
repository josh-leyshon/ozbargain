import type React from 'react';
import type { ReactNode } from 'react';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Text } from '../../../base/components/text/text';
import { Column, Row } from '../../../base/layout/flex';

export type DealCardProps = {
  title: string;
  dealMeta: ReactNode;
  imageUrl?: string;
};

export function DealCardInfo({
  title,
  dealMeta,
  imageUrl,
}: DealCardProps): React.JSX.Element {
  return (
    <Column
      justifyContent='space-between'
      gap='medium'
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

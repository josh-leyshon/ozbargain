import type React from 'react';
import type { ReactNode } from 'react';
import { Card } from '../../../base/components/card/card';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Text } from '../../../base/components/text/text';
import { Row } from '../../../base/layout/flex';

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
    <Card
      direction='column'
      justifyContent='space-between'
      gap='medium'
      padding='large'
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
    </Card>
  );
}

const cardImageSizePx = 96;

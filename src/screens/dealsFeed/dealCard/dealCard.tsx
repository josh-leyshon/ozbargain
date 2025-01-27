import type React from 'react';
import type { ReactNode } from 'react';
import { SquareImage } from '../../../base/components/image/squareImage';
import { Column, Row } from '../../../base/layout/flex';
import type { Deal } from '../../../parsers/xml-feed/parser';
import { renderDealCardTitle } from './renderTitle';

export type DealCardProps = {
  title: Deal['title'];
  dealMeta: ReactNode;
  imageUrl?: string;
};

export function DealCardInfo({
  title,
  dealMeta,
  imageUrl,
}: DealCardProps): React.JSX.Element {
  return (
    <Column justifyContent='space-between' gap='medium'>
      {renderDealCardTitle(title)}
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

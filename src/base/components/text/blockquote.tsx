import type React from 'react';
import { Column, Row } from '../../layout/flex';
import type { OmitStrict } from '../../types/omitStrict';
import { VerticalDivider } from '../divider/divider';
import type { TextProps } from './text';
import { Text } from './text';

export type BlockquoteProps = OmitStrict<TextProps, 'children'> & {
  children: string;
};

/**
 * A block view that displays a stylised text quote.
 */
export function Blockquote({ children, ...props }: BlockquoteProps): React.JSX.Element {
  return (
    <Row gap='medium' justifyContent='flex-start'>
      <VerticalDivider colour='copyLighter' />
      <Column
        // Text will expand horizontally to the max size of the container (screen).
        grow={1}
        // Text will not overflow the container horizontally.
        shrink={1}
        paddingBlock='small'
      >
        <Text {...props}>{children}</Text>
      </Column>
    </Row>
  );
}

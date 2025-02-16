import type React from 'react';
import { colours } from '../../constants/colours';
import { sizes } from '../../constants/sizes';
import { Column, type FlexLayoutProps } from '../../layout/flex';

export type VerticalDividerProps = {
  colour: keyof (typeof colours);
} & Pick<FlexLayoutProps, 'style'>;

/**
 * A thin coloured vertical bar.
 */
export function VerticalDivider({ colour, style }: VerticalDividerProps): React.JSX.Element {
  const width = sizes.small / 2;
  const backgroundColor = colours[colour];

  return (
    <Column
      style={[
        {
          width,
          borderRadius: width,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

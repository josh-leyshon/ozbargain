import type React from 'react';
import { StyleSheet } from 'react-native';
import { colours } from '../../constants/colours';
import { sizes } from '../../constants/sizes';
import type { FlexLayoutProps } from '../../layout/flex';
import { Column, Row } from '../../layout/flex';

export type CardProps = {
  /**
   * Which type of Flex layout to use.
   * @default 'column'
   */
  direction?: 'row' | 'column';
} & FlexLayoutProps;

/**
 * A Card is a styled Flex container.
 */
export function Card({ direction = 'column', style, ...props }: CardProps): React.JSX.Element {
  const FlexContainer = direction === 'column' ? Column : Row;
  return <FlexContainer {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: sizes.medium,
    backgroundColor: colours.foreground,
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  },
});

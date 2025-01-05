import type React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';
import { StyleSheet, Text as RNText } from 'react-native';
import { colours } from '../../constants/colours';
import type { FontSize, FontWeight } from '../../constants/text';
import { fontSizes, fontWeights } from '../../constants/text';
import { UnreachableError } from '../../unreachableError';

type TextColour = 'normal' | 'light' | 'veryLight';

export type TextProps = {
  /** Default: medium */
  size?: FontSize;
  /** Default: normal */
  weight?: FontWeight;
  /** Default: normal */
  colour?: TextColour;
  children: ReactNode;
  style?: StyleProp<
    Omit<
      TextStyle,
      | 'fontSize'
      | 'fontWeight'
      | 'color'
    >
  >;
} & Omit<RNTextProps, 'style' | 'children'>;

export function Text({ size, weight, colour, children, style, ...props }: TextProps): React.JSX.Element {
  const styles = StyleSheet.create({
    container: {
      fontSize: getFontSize(size ?? 'medium'),
      fontWeight: getFontWeight(weight ?? 'normal'),
      color: getTextColour(colour ?? 'normal'),
    },
  });

  return <RNText style={[styles.container, style]} {...props}>{children}</RNText>;
}

function getFontSize(size: FontSize): TextStyle['fontSize'] {
  switch (size) {
    case 'small':
      return fontSizes.small;
    case 'medium':
      return fontSizes.medium;
    case 'large':
      return fontSizes.large;
    default:
      throw new UnreachableError(size);
  }
}

function getFontWeight(weight: FontWeight): TextStyle['fontWeight'] {
  switch (weight) {
    case 'thin':
      return fontWeights.thin;
    case 'normal':
      return fontWeights.normal;
    case 'bold':
      return fontWeights.bold;
    default:
      throw new UnreachableError(weight);
  }
}

function getTextColour(colour: TextColour): TextStyle['color'] {
  switch (colour) {
    case 'normal':
      return colours.copy;
    case 'light':
      return colours.copyLight;
    case 'veryLight':
      return colours.copyLighter;
    default:
      throw new UnreachableError(colour);
  }
}

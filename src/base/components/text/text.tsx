import type React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';
import { StyleSheet, Text as RNText } from 'react-native';
import { colours } from '../../constants/colours';
import type { FontSize, FontWeight } from '../../constants/text';
import { fontSizes, fontWeights } from '../../constants/text';
import { UnreachableError } from '../../unreachableError';

type TextColour = 'normal' | 'light' | 'veryLight' | keyof Pick<typeof colours, 'primaryDark' | 'secondaryDark'>;

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

type StatusTextColour = keyof Pick<typeof colours, 'success' | 'warning' | 'error'>;
type StatusTextProps = Omit<TextProps, 'colour'> & { colour: StatusTextColour };

type InternalTextProps = TextProps | StatusTextProps;

/**
 * Use for all regular text displayed in the app.
 */
export function Text(props: TextProps): React.JSX.Element {
  return <InternalText {...props} />;
}

/**
 * Use only for text that is displaying over a 'status' background colour.
 * Otherwise use the base `<Text>`.
 */
export function StatusText(props: StatusTextProps): React.JSX.Element {
  return <InternalText {...props} />;
}

function InternalText(
  { size, weight, colour, children, style, ...props }: InternalTextProps,
): React.JSX.Element {
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

function getTextColour(colour: TextColour | StatusTextColour): TextStyle['color'] {
  switch (colour) {
    case 'normal':
      return colours.copy;
    case 'light':
      return colours.copyLight;
    case 'veryLight':
      return colours.copyLighter;
    case 'primaryDark':
      return colours.primaryDark;
    case 'secondaryDark':
      return colours.secondaryDark;
    case 'success':
      return colours.successContent;
    case 'warning':
      return colours.warningContent;
    case 'error':
      return colours.errorContent;
    default:
      throw new UnreachableError(colour);
  }
}

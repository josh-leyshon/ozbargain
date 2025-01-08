import { Button as ReactNativeButton, StyleSheet } from 'react-native';
import type { ButtonProps as ReactNativeButtonProps } from 'react-native';
import { Column } from '../../layout/flex';

/** Exported for testing. */
export const buttonColours = {
  orange: '#ffbd59',
  green: '#82f152',
  lightGreen: '#a0ff77',
  veryLightGreen: '#aaff85',
  red: '#f15e5e',
  lightRed: '#ffb7b7',
  veryLightRed: '#ffcfcf',
} as const;

export type ButtonColours = keyof typeof buttonColours;

type ButtonProps = {
  title: ReactNativeButtonProps['title'];
  onPress: ReactNativeButtonProps['onPress'];
  color: ButtonColours;
  /**
   * Whether the button width should grow to fit it's content
   * when sharing a flex container with other buttons.
   * @default false
   */
  fitContent?: boolean;
};

export function Button({ title, onPress, color, fitContent = false }: ButtonProps): React.JSX.Element {
  const buttonColour = buttonColours[color];
  return (
    // Buttons are wrapped in a flex column so they can always expand horizontally
    // to the width of their container.
    <Column style={[styles.container, fitContent ? styles.fitContent : undefined]}>
      <ReactNativeButton title={title} onPress={onPress} color={buttonColour} />
    </Column>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fitContent: {
    flexBasis: 'auto',
  },
});

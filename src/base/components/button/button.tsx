import { Button as ReactNativeButton, View, StyleSheet } from 'react-native';
import type { ButtonProps as ReactNativeButtonProps } from 'react-native';

const buttonColours = {
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
};

export function Button({ color, title, onPress }: ButtonProps): JSX.Element {
  const buttonColour = buttonColours[color];
  return (
    // TODO: Could use a custom Pressable component to add styles, instead of a Button wrapped in a View.
    <View style={styles.container}>
      <ReactNativeButton title={title} onPress={onPress} color={buttonColour} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Buttons should expand to fill available container space by default.
    // Larger buttons are better for mobile touch targets.
    flexBasis: 1,
    flexGrow: 1,
  },
});

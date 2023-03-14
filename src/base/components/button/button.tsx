import { Button as ReactNativeButton } from 'react-native';
import type { ButtonProps as ReactNativeButtonProps } from 'react-native';

const colors = {
  orange: '#ffbd59',
  green: '#82f152',
  lightgreen: '#beffa2',
  red: '#f15e5e',
  lightred: '#ffb7b7',
} as const;

type Colors = keyof typeof colors;

type ButtonProps = {
  title: ReactNativeButtonProps['title'];
  onPress: ReactNativeButtonProps['onPress'];
  color: Colors;
};

export function Button({ color, title, onPress }: ButtonProps): JSX.Element {
  const buttonColor = colors[color];
  return (
    <ReactNativeButton title={title} onPress={onPress} color={buttonColor} />
  );
}

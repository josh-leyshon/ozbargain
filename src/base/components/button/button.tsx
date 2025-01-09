import type { ButtonProps as ReactNativeButtonProps } from 'react-native';
import { Button as ReactNativeButton } from 'react-native';
import { colours } from '../../constants/colours';
import { Column } from '../../layout/flex';

/** Exported for testing. */
export const buttonColours = {
  primary: colours.primary,
  secondary: colours.secondary,
} as const;

export type ButtonColour = keyof typeof buttonColours;

type ButtonProps = {
  title: ReactNativeButtonProps['title'];
  onPress: ReactNativeButtonProps['onPress'];
  colour: ButtonColour;
  /**
   * Whether the button width should grow to fit it's content
   * when sharing a flex container with other buttons.
   * @default false
   */
  fitContent?: boolean;
};

export function Button({ title, onPress, colour, fitContent = false }: ButtonProps): React.JSX.Element {
  const buttonColour = buttonColours[colour];
  return (
    // Buttons are wrapped in a flex column so they can always expand horizontally
    // to the width of their container.
    <Column
      {...(fitContent && {
        grow: 1,
        shrink: 1,
      })}
    >
      <ReactNativeButton title={title} onPress={onPress} color={buttonColour} />
    </Column>
  );
}

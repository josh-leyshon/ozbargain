import Icon from '@expo/vector-icons/MaterialIcons';
import type React from 'react';
import { useState } from 'react';
import { colours } from '../../constants/colours';
import type { TextProps } from './text';
import { Text } from './text';

export type LinkProps = Omit<TextProps, 'children' | 'colour'> & {
  children: string;
  onPress: () => void;
  onLongPress?: () => void;
};

/**
 * A styled Text element that should open a link when pressed.
 * Intended to be nested within a Text element.
 */
export function Link({ onPress, onLongPress, children, ...props }: LinkProps): React.JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <Text
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text {...props} colour={pressed ? 'primaryLight' : 'primaryDark'}>
        {children}
      </Text>
      <Icon
        name='arrow-outward'
        color={pressed ? colours.primaryLight : colours.primaryDark}
      />
    </Text>
  );
}

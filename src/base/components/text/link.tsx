import Icon from '@expo/vector-icons/MaterialIcons';
import type React from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { colours } from '../../constants/colours';
import { fontSizes } from '../../constants/text';
import { Row } from '../../layout/flex';
import type { TextProps } from './text';
import { Text } from './text';

export type LinkProps = Omit<TextProps, 'colour'> & {
  onPress: () => void;
};

/**
 * A styled Text element that should open a link when pressed.
 */
export function Link({ onPress, children, ...props }: LinkProps): React.JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <Row gap='small' alignItems='center'>
        <Text {...props} colour={pressed ? 'primaryLight' : 'primaryDark'}>
          {children}
        </Text>
        <Icon
          name='arrow-outward'
          size={fontSizes.medium}
          color={pressed ? colours.primaryLight : colours.primaryDark}
        />
      </Row>
    </Pressable>
  );
}

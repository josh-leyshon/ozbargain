import Icon from '@expo/vector-icons/MaterialIcons';
import type React from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { colours } from '../../constants/colours';
import { Row } from '../../layout/flex';
import type { TextProps } from './text';
import { Text } from './text';

export type LinkProps = Omit<TextProps, 'children' | 'colour'> & {
  children: string;
  onPress: () => void;
};

/**
 * A styled Text element that should open a link when pressed.
 * Intended to be nested within a Text element.
 */
export function Link({ onPress, children, ...props }: LinkProps): React.JSX.Element {
  const [pressed, setPressed] = useState(false);

  // I noticed that only on Android, Text following the View would not have adequate spacing.
  // The end of the view and the start of the Text would be touching or overlapping.
  // This padding was added to help that. The value was chosen manually after checking what looks good enough.
  // I however have no idea _why_ this value is the right one to look good enough.
  //
  // It also expects that the Text next to this Link will have a space " " first,
  // because my TextPart algorithm should do that.
  const paddingEnd = children.length * 0.75;

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={Platform.OS === 'android' ? [styles.pressableAndroid, { paddingEnd }] : undefined}
    >
      <Row alignItems='center'>
        <Text {...props} colour={pressed ? 'primaryLight' : 'primaryDark'}>
          {children}
        </Text>
        <Icon
          name='arrow-outward'
          color={pressed ? colours.primaryLight : colours.primaryDark}
        />
      </Row>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableAndroid: {
    // Nesting Views within Text on Android will add extra bottom margin/something to the View,
    // which you can't get rid of. This makes the text/items within the View render higher than the surrounding text.
    //
    // This workaround moves the view down by a fixed amount that roughly aligns the View with the Text.
    // It's not perfect and should be replaced when this issue is fixed:
    // https://github.com/facebook/react-native/issues/31955
    // This workaround was suggested in the same issue:
    // https://github.com/facebook/react-native/issues/31955#issuecomment-1586109201
    transform: [{ translateY: 2 }],
  },
});

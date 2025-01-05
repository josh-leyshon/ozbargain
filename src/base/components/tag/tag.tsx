import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { colours } from '../../constants/colours';
import { sizes } from '../../constants/sizes';
import { Row } from '../../layout/flex';
import { UnreachableError } from '../../unreachableError';
import { StatusText, Text } from '../text/text';

type TagColour = 'primary' | 'normal' | 'success' | 'warning' | 'error';

export type TagProps = {
  icon?: ReactNode;
  children?: string | number;
  colour: TagColour;
};

export function Tag({ icon, children, colour }: TagProps): React.JSX.Element {
  const colourStyle = getColourStyle(colour);
  const content = children != null
    ? (colour === 'success' || colour === 'warning' || colour === 'error')
      ? <StatusText colour={colour}>{children}</StatusText>
      : <Text>{children}</Text>
    : null;

  return (
    <Row justifyContent='flex-start' alignItems='center' gap='small' style={[styles.tag, colourStyle]}>
      {icon}
      {content}
    </Row>
  );
}

function getColourStyle(colour: TagColour) {
  switch (colour) {
    case 'primary':
      return colourStyles.primary;
    case 'normal':
      return colourStyles.normal;
    case 'success':
      return colourStyles.success;
    case 'warning':
      return colourStyles.warning;
    case 'error':
      return colourStyles.error;
    default:
      throw new UnreachableError(colour);
  }
}

const styles = StyleSheet.create({
  tag: {
    paddingBlock: sizes.small,
    paddingInline: sizes.medium,
    borderRadius: sizes.small * 1.5,
  },
});

const colourStyles = StyleSheet.create({
  primary: {
    backgroundColor: colours.primaryLight,
  },
  normal: {
    backgroundColor: colours.background,
  },
  success: {
    backgroundColor: colours.success,
  },
  warning: {
    backgroundColor: colours.warning,
  },
  error: {
    backgroundColor: colours.error,
  },
});

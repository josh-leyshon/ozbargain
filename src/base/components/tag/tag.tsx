import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { colours } from '../../constants/colours';
import { sizes } from '../../constants/sizes';
import { fontSizes } from '../../constants/text';
import { Row } from '../../layout/flex';
import { UnreachableError } from '../../unreachableError';
import { Text } from '../text/text';

type TagColour = 'orange' | 'green' | 'yellow' | 'red' | 'grey';

type TagProps = {
  icon?: ReactNode;
  children?: string | number;
  colour: TagColour;
};

export function Tag({ icon, children, colour }: TagProps): React.JSX.Element {
  const colourStyle = getColourStyle(colour);

  return (
    <Row justifyContent='flex-start' alignItems='center' gap='extraSmall' style={[styles.tag, colourStyle]}>
      {icon}
      {children !== undefined && <Text size='small'>{children}</Text>}
    </Row>
  );
}

function getColourStyle(colour: TagColour) {
  switch (colour) {
    case 'orange':
      return colourStyles.orange;
    case 'green':
      return colourStyles.green;
    case 'yellow':
      return colourStyles.yellow;
    case 'red':
      return colourStyles.red;
    case 'grey':
      return colourStyles.grey;
    default:
      throw new UnreachableError(colour);
  }
}

const styles = StyleSheet.create({
  tag: {
    paddingBlock: sizes.small,
    paddingInline: sizes.medium,
    borderRadius: sizes.small * 1.5,
    fontSize: fontSizes.small,
  },
});

const colourStyles = StyleSheet.create({
  orange: {
    backgroundColor: colours.primaryLight,
  },
  green: {
    backgroundColor: colours.success,
  },
  yellow: {
    backgroundColor: colours.warning,
  },
  red: {
    backgroundColor: colours.error,
  },
  grey: {
    backgroundColor: colours.background,
  },
});

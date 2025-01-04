import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colours } from '../../colours/colours';
import { Row } from '../../layout/flex';
import { UnreachableError } from '../../unreachableError';

type TagColour = 'orange' | 'green' | 'yellow' | 'red' | 'grey';

type TagProps = {
  icon?: ReactNode;
  children?: string | number;
  colour: TagColour;
};

export function Tag({ icon, children, colour }: TagProps): React.JSX.Element {
  const colourStyle = getColourStyle(colour);

  return (
    <Row justifyContent='flex-start' alignItems='center' gap={2} style={[styles.tag, colourStyle]}>
      {icon}
      {children !== undefined && <Text style={styles.tagContent}>{children}</Text>}
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
    paddingBlock: 4,
    paddingInline: 8,
    borderRadius: 6,
    fontSize: 12,
  },
  tagContent: {
    fontSize: 12,
    color: colours.copy,
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

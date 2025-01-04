import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colours } from '../../colours/colours';
import { Row } from '../../layout/flex';
import { UnreachableError } from '../../unreachableError';

type TagColour = 'orange' | 'white';

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
      return styles.colourOrange;
    case 'white':
      return styles.colourWhite;
    default:
      throw new UnreachableError(colour);
  }
}

const styles = StyleSheet.create({
  tag: {
    padding: 4,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 12,
  },
  tagContent: {
    fontSize: 12,
  },
  colourOrange: {
    borderColor: colours.light.secondary,
    backgroundColor: colours.light.tertiary,
  },
  colourWhite: {
    borderColor: 'rgb(215, 215, 215)',
    backgroundColor: 'rgb(255, 255, 255)',
  },
});

import { View, Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type SquareImageProps = {
  source: ImageSourcePropType;
  sizePx: number;
};

export function SquareImage({ sizePx, source }: SquareImageProps): JSX.Element {
  const { containerSize, imageSize } = StyleSheet.create({
    containerSize: {
      width: sizePx,
      height: sizePx,
    },
    imageSize: {
      width: sizePx - 2 * borderThickness,
      height: sizePx - 2 * borderThickness,
      borderRadius,
    },
  });

  return (
    <View style={[styles.container, containerSize]}>
      <Image style={imageSize} source={source} resizeMode="center" />
    </View>
  );
}

const borderThickness = 2;
const borderRadius = 8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: borderThickness,
    borderColor: 'purple',
    borderRadius,
  },
});

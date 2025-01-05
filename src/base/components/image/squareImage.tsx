import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { sizes } from '../../constants/sizes';

type SquareImageProps = {
  source: ImageSourcePropType;
  sizePx: number;
};

export function SquareImage({ sizePx, source }: SquareImageProps): React.JSX.Element {
  const { containerSize, imageSize } = StyleSheet.create({
    containerSize: {
      width: sizePx,
      height: sizePx,
    },
    imageSize: {
      width: sizePx,
      height: sizePx,
      borderRadius,
    },
  });

  return (
    <View style={[styles.container, containerSize]}>
      <Image style={imageSize} source={source} resizeMode='center' />
    </View>
  );
}

const borderRadius = sizes.medium;

const styles = StyleSheet.create({
  container: {
    borderRadius,
  },
});

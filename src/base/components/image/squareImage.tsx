import {
  View,
  Image,
  StyleSheet,
  type ImageSourcePropType,
  type ViewStyle,
} from "react-native";

type SquareImageProps = {
  source: ImageSourcePropType;
  sizePx: number;
};

export function SquareImage(props: SquareImageProps): JSX.Element {
  const { containerSize, imageSize } = StyleSheet.create({
    containerSize: {
      width: props.sizePx,
      height: props.sizePx,
    },
    imageSize: {
      width: props.sizePx - 2 * borderThickness,
      height: props.sizePx - 2 * borderThickness,
      borderRadius: borderRadius,
    },
  });

  return (
    <View style={[styles.container, containerSize]}>
      <Image style={imageSize} source={props.source} resizeMode="center" />
    </View>
  );
}

const borderThickness = 2;
const borderRadius = 8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderWidth: borderThickness,
    borderColor: "purple",
    borderRadius: borderRadius,
  },
});

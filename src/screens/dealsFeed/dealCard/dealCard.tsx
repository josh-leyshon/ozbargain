import { View, Text, Image, StyleSheet } from "react-native";

export type DealCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
};

export function DealCard(props: DealCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      <TextSection title={props.title} description={props.description} />
      {props.imageUrl != null && <ImageContainer imgUri={props.imageUrl} />}
    </View>
  );
}

function TextSection(props: {
  title: string;
  description: string;
}): JSX.Element {
  // 2 lines for title and 5 lines for description, plus marginBottom == 8 on title,
  // fits perfectly within 160px cardHeight.
  return (
    <View style={styles.textSection}>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {props.title}
      </Text>
      <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
        {props.description}
      </Text>
    </View>
  );
}

function ImageContainer({ imgUri }: { imgUri: string }): JSX.Element {
  return (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: imgUri }} />
    </View>
  );
}

const cardHeightPx = 160;
const cardSpacingPx = 16;

const cardImageBorderThicknessPx = 2;
const cardImageDimensionsPx =
  cardHeightPx - 2 * cardSpacingPx - 2 * cardImageBorderThicknessPx;

const veryLightGrey = "rgb(244, 244, 244)";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",

    height: 160,
    maxHeight: 160,

    backgroundColor: veryLightGrey,

    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 8,

    padding: cardSpacingPx,
  },
  textSection: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    overflow: "hidden",
  },
  image: {
    width: cardImageDimensionsPx,
    height: cardImageDimensionsPx,
    resizeMode: "contain",
    backgroundColor: "white",
  },
  imageContainer: {
    marginLeft: cardSpacingPx,

    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "purple",
    borderRadius: 8,
  },
});

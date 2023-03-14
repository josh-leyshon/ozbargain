import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SquareImage } from '../../../base/components/image/squareImage';

export type DealCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  onPress: () => void;
};

export function DealCard({
  description,
  onPress,
  title,
  imageUrl,
}: DealCardProps): JSX.Element {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <TextSection title={title} description={description} />
        {imageUrl != null && (
          <SquareImage
            source={{ uri: imageUrl }}
            sizePx={cardContentHeightPx}
          />
        )}
      </View>
    </Pressable>
  );
}

function TextSection({
  title,
  description,
}: {
  title: string;
  description: string;
}): JSX.Element {
  // 2 lines for title and 5 lines for description, plus marginBottom == 8 on title,
  // fits perfectly within 160px cardHeight.
  return (
    <View style={styles.textSection}>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={5} ellipsizeMode="tail">
        {description}
      </Text>
    </View>
  );
}

const cardBorderThickness = 2;
const cardContentHeightPx = 128;
const cardPaddingPx = 16;
const cardMaxHeightPx =
  cardContentHeightPx + 2 * cardPaddingPx + 2 * cardBorderThickness;

const veryLightGrey = 'rgb(244, 244, 244)';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: cardPaddingPx,

    height: cardMaxHeightPx,
    maxHeight: cardMaxHeightPx,
    padding: cardPaddingPx,

    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 8,

    backgroundColor: veryLightGrey,
  },
  textSection: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 11,
  },
});

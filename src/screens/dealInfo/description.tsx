import { Text, StyleSheet } from "react-native";
import type { OzbargainFeed } from "../../feed-parser/parser";

type DescriptionProps = {
  description: OzbargainFeed["deals"][number]["description"];
};

export function Description({ description }: DescriptionProps): JSX.Element {
  return <Text style={styles.justify}>{description}</Text>;
}

const styles = StyleSheet.create({
  justify: {
    textAlign: "justify",
  },
});

import { StyleSheet, View } from "react-native";
import { Button } from "../../base/components/button/button";
import { Column, Row } from "../../base/layout/flex";
import type { OzbargainFeed } from "../../feed-parser/parser";

type LinkButtonProps = Pick<
  OzbargainFeed["deals"][number]["links"],
  "deal" | "productPage"
>;

export function LinkButtons({
  deal,
  productPage,
}: LinkButtonProps): JSX.Element {
  return (
    <Column gap={16}>
      <Button title="Go to deal" color="orange" onPress={() => undefined} />
      <Row gap={16}>
        <View style={styles.buttonContainer}>
          <Button
            title="Open on Ozbargain"
            color="orange"
            onPress={() => undefined}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Share" color="orange" onPress={() => undefined} />
        </View>
      </Row>
    </Column>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexBasis: 1,
    flexGrow: 1,
  },
});

import { Platform, StyleSheet, View } from "react-native";
import { Button } from "../../base/components/button/button";
import { Column, Row } from "../../base/layout/flex";

type LinkButtonProps = {
  onPressGoToDeal: () => Promise<void>;
  onPressOpenOnOzbargain: () => Promise<void>;
  onPressShare: () => Promise<void>;
};

export function LinkButtons({
  onPressGoToDeal,
  onPressOpenOnOzbargain,
  onPressShare,
}: LinkButtonProps): JSX.Element {
  return (
    <Column gap={16}>
      <Button title="Go to deal" color="orange" onPress={onPressGoToDeal} />
      <Row gap={16}>
        <View style={styles.buttonContainer}>
          <Button
            title="Open on Ozbargain"
            color="orange"
            onPress={onPressOpenOnOzbargain}
          />
        </View>
        {Platform.OS !== "web" && (
          <View style={styles.buttonContainer}>
            <Button title="Share" color="orange" onPress={onPressShare} />
          </View>
        )}
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

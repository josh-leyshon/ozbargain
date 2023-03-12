import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Column } from "../../layout/flex";

type FullscreenAreaProps = {
  children: ReactNode;
};

export function FullscreenArea({ children }: FullscreenAreaProps): JSX.Element {
  return (
    <Column wrap="nowrap" style={styles.container}>
      {children}
    </Column>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
  },
});

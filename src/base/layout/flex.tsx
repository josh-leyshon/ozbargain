import { ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

type FlexLayoutProps = {
  children: ReactNode;
  /** Default: space-between */
  justifyContent?: ViewStyle["justifyContent"];
  /** Default: stretch */
  alignItems?: ViewStyle["alignItems"];
  /** Default: undefined */
  shrink?: ViewStyle["flexShrink"];
  /** Default: undefined */
  grow?: ViewStyle["flexGrow"];
  /** Default: unset */
  gap?: number;
  style?: StyleProp<
    Omit<ViewStyle, "justifyContent" | "alignItems" | "flexShrink" | "flexGrow">
  >;
};

export function Row({
  children,
  justifyContent,
  alignItems,
  shrink,
  grow,
  gap,
  style,
}: FlexLayoutProps): JSX.Element {
  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: justifyContent ?? "space-between",
      alignItems: alignItems ?? "stretch",
      flexShrink: shrink,
      flexGrow: grow,
      gap,
    },
  });

  return <View style={[styles.row, style]}>{children}</View>;
}

export function Column({
  children,
  justifyContent,
  alignItems,
  shrink,
  grow,
  gap,
  style,
}: FlexLayoutProps): JSX.Element {
  const styles = StyleSheet.create({
    column: {
      flexDirection: "column",
      justifyContent: justifyContent ?? "space-between",
      alignItems: alignItems ?? "stretch",
      flexShrink: shrink,
      flexGrow: grow,
      gap,
    },
  });

  return <View style={[styles.column, style]}>{children}</View>;
}

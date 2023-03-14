import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type FlexLayoutProps = {
  children: ReactNode;
  /** Default: space-between */
  justifyContent?: ViewStyle['justifyContent'];
  /** Default: stretch */
  alignItems?: ViewStyle['alignItems'];
  /** Default: undefined */
  shrink?: ViewStyle['flexShrink'];
  /** Default: undefined */
  grow?: ViewStyle['flexGrow'];
  /** Default: nowrap */
  wrap?: ViewStyle['flexWrap'];
  /** Default: unset */
  gap?: number;
  style?: StyleProp<
    Omit<
      ViewStyle,
      'justifyContent' | 'alignItems' | 'flexShrink' | 'flexGrow' | 'flexWrap'
    >
  >;
};

export function Row(props: FlexLayoutProps): JSX.Element {
  return FlexView({ direction: 'row', ...props });
}

export function Column(props: FlexLayoutProps): JSX.Element {
  return FlexView({ direction: 'column', ...props });
}

function FlexView({
  children,
  direction,
  justifyContent,
  alignItems,
  shrink,
  grow,
  wrap,
  gap,
  style,
}: FlexLayoutProps & { direction: ViewStyle['flexDirection'] }): JSX.Element {
  const styles = StyleSheet.create({
    column: {
      flexDirection: direction,
      justifyContent: justifyContent ?? 'space-between',
      alignItems: alignItems ?? 'stretch',
      flexShrink: shrink,
      flexGrow: grow,
      flexWrap: wrap,
      gap,
    },
  });

  return <View style={[styles.column, style]}>{children}</View>;
}

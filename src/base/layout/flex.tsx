import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { type Size, sizes } from '../constants/sizes';

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
  gap?: Size;
  /** Default: unset */
  padding?: Size;
  /**
   * Has priority over `padding`.
   * Default: unset
   */
  paddingInline?: Size;
  /**
   * Has priority over `padding`.
   * Default: unset
   */
  paddingBlock?: Size;
  style?: StyleProp<
    Omit<
      ViewStyle,
      | 'justifyContent'
      | 'alignItems'
      | 'flexShrink'
      | 'flexGrow'
      | 'flexWrap'
      | 'gap'
      | 'padding'
      | 'paddingInline'
      | 'paddingBlock'
    >
  >;
};

export function Row(props: FlexLayoutProps): React.JSX.Element {
  return FlexView({ direction: 'row', ...props });
}

export function Column(props: FlexLayoutProps): React.JSX.Element {
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
  padding,
  paddingInline,
  paddingBlock,
  style,
}: FlexLayoutProps & { direction: ViewStyle['flexDirection'] }): React.JSX.Element {
  const styles = StyleSheet.create({
    container: {
      flexDirection: direction,
      justifyContent: justifyContent ?? 'space-between',
      alignItems: alignItems ?? 'stretch',
      flexShrink: shrink,
      flexGrow: grow,
      flexWrap: wrap,
      ...(gap && { gap: sizes[gap] }),
      ...(padding && { padding: sizes[padding] }),
      ...(paddingInline && { paddingInline: sizes[paddingInline] }),
      ...(paddingBlock && { paddingBlock: sizes[paddingBlock] }),
    },
  });

  return <View style={[styles.container, style]}>{children}</View>;
}

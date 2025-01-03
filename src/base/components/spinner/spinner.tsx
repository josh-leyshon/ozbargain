import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';

type SpinnerProps = React.PropsWithChildren<{
  /** Revolutions to spin per second. Default: 1 */
  revsPerSecond?: number;
}>;

/**
 * A rotating component. Any children will spin.
 */
export function Spinner({
  children,
  revsPerSecond,
}: SpinnerProps): React.JSX.Element {
  const rotationValue = useRef(new Animated.Value(0)).current;

  // Start animation inside useEffect because we only want to re-start it when the value is re-set,
  // which should be never since it is a ref.
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 1000 / (revsPerSecond ?? 1),
        easing: Easing.linear,
        // On web, looping does not work with useNativeDriver enabled.
        useNativeDriver: Platform.OS !== 'web',
      }),
    ).start();
  }, [rotationValue, revsPerSecond]);

  const rotationInDegrees = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        ...styles.container,
        transform: [
          { rotate: rotationInDegrees },
          // For rotations to be visible on Android. See: https://reactnative.dev/docs/animations#bear-in-mind
          { perspective: 1000 },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
});

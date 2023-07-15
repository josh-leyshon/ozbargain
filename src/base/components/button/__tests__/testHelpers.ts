import { Platform } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import type { JestNativeMatchers } from '@testing-library/jest-native/extend-expect';
import type { ButtonColours } from '../button';
import { buttonColours } from '../button';
import { assert } from '../../../assert';

type ToHaveStyleParam = Parameters<JestNativeMatchers<void>['toHaveStyle']>[0];

/**
 * A helper for tests to check the colour of the base Button component, that accounts for platform differences.
 * @param buttonTextElement The inner-most Text component on the Button. This is likely what you have if you used `*ByText` from @testing-library/react-native.
 * @param colour The expected button colour.
 */
export function expectButtonColour(
  buttonTextElement: ReactTestInstance,
  colour: ButtonColours,
): void {
  const button = Platform.select({
    ios: buttonTextElement,
    default: buttonTextElement.parent?.parent,
  });

  assert(
    button != null,
    'Given element did not have expected parents. It is likely not an instance of the base Button component.',
  );

  expect(button).toHaveStyle(
    Platform.select<ToHaveStyleParam>({
      ios: {
        color: buttonColours[colour],
      },
      default: {
        backgroundColor: buttonColours[colour],
      },
    }),
  );
}

/**
 * Base sizes in pixels, for consistency throughout the app.
 */
export const sizes = {
  extraSmall: 2,
  small: 4,
  medium: 8,
  large: 16,
} as const;

export type Size = keyof typeof sizes;

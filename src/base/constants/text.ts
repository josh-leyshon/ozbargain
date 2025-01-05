/**
 * Base font sizes in pixels, for consistency throughout the app.
 */
export const fontSizes = {
  small: 12,
  medium: 14,
  large: 16,
} as const;

export type FontSize = keyof typeof fontSizes;

export const fontWeights = {
  thin: 200,
  normal: 400,
  bold: 700,
} as const;

export type FontWeight = keyof typeof fontWeights;

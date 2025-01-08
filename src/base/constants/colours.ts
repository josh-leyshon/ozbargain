// Colours generated with: https://www.hover.dev/css-color-palette-generator
// Based on the input primary orange colour,
// and the secondary colour's hue being at 210 degrees.
// 'foreground' was manually lightened to pure white because it needs to blend in
// with deal image backgrounds, which are white.
// 'copy' was darkened to black for contrast on the new 'foreground'.
// 'success', 'warning' and 'error' were manually softened/lightened a bit from the generated colours.
export const colours = {
  primary: 'rgb(237, 188, 89)',
  primaryContent: 'rgb(64, 45, 7)',
  primaryDark: 'rgb(232, 169, 43)',
  primaryLight: 'rgb(242, 207, 135)',

  secondary: 'rgb(114, 89, 237)',
  secondaryContent: 'rgb(255, 255, 255)',
  secondaryDark: 'rgb(75, 43, 232)',
  secondaryLight: 'rgb(153, 135, 242)',

  background: 'rgb(241, 240, 239)',
  foreground: 'rgb(255, 255, 255)',
  border: 'rgb(226, 224, 221)',

  copy: 'rgb(0, 0, 0)',
  copyLight: 'rgb(110, 105, 94)',
  copyLighter: 'rgb(149, 143, 132)',

  success: 'rgb(129, 234, 129)',
  warning: 'rgb(251, 251, 129)',
  error: 'rgb(249, 119, 119)',
  successContent: 'rgb(7, 64, 7)',
  warningContent: 'rgb(64, 64, 7)',
  errorContent: 'rgb(64, 7, 7)',
} as const;

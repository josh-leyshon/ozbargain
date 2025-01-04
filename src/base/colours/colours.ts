export type Colours = 'primary' | 'secondary' | 'tertiary' | 'backgroundPrimary';

export type Theme = {
  light: Record<Colours, string>;
};

export const colours = {
  light: {
    primary: 'rgb(255, 189, 89)',
    secondary: 'rgb(255, 218, 110)',
    tertiary: 'rgb(255, 243, 206)',
    backgroundPrimary: 'rgb(255, 255, 255)',
  },
} satisfies Theme;

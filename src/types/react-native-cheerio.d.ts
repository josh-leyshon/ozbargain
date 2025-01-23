declare module 'react-native-cheerio' {
  type Dollar = (query: string, context?: any, rootContext?: any) => any;

  type DollarResult = Dollar & {
    text(): string;
    map(fn: (index: number, element: DollarResult) => any): DollarResult;
    children: Dollar;
  };

  function load(html: string): Dollar;
}

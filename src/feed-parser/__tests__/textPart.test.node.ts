import { partText } from '../textParts';

test.each([
  { input: 'abc', expectedNormalTexts: ['abc'] },
  { input: '123', expectedNormalTexts: ['123'] },
  { input: 'abc 123', expectedNormalTexts: ['abc 123'] },
  { input: '', expectedNormalTexts: [''] },
  { input: '   ', expectedNormalTexts: ['   '] },
])('Normal text: "%s"', testCase => {
  const textParts = partText(testCase.input);

  const prices = textParts.parts.map(part => part.text);
  expect(prices).toStrictEqual(testCase.expectedNormalTexts);
});

test.each([
  { input: '$123', expectedPrices: ['$123'] },
  { input: '$1.23', expectedPrices: ['$1.23'] },
  { input: '$2.00', expectedPrices: ['$2.00'] },
  { input: '$abc $123 def', expectedPrices: ['$123'] },
  { input: '$abc', expectedPrices: [] },
  { input: '$2.f', expectedPrices: ['$2'] },
  { input: '$.2', expectedPrices: [] },
  { input: '$0.2', expectedPrices: ['$0.2'] },
  { input: '$1 $2 abc $3', expectedPrices: ['$1', '$2', '$3'] },
])('Prices: "%s"', testCase => {
  const textParts = partText(testCase.input);

  const prices = textParts.parts.filter(part => part.type === 'price').map(part => part.text);
  expect(prices).toStrictEqual(testCase.expectedPrices);
});

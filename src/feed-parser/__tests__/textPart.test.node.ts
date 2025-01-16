import { INTERNAL_LINK_PREFIX, partText } from '../textParts';

test.each([
  { input: 'abc', expectedNormalTexts: ['abc'] },
  { input: '123', expectedNormalTexts: ['123'] },
  { input: 'abc 123', expectedNormalTexts: ['abc 123'] },
  { input: '', expectedNormalTexts: [''] },
  { input: '   ', expectedNormalTexts: ['   '] },
])('Normal text: "$input"', testCase => {
  const textParts = partText(testCase.input);

  const normalTexts = textParts.parts.map(part => part.text);
  expect(normalTexts).toStrictEqual(testCase.expectedNormalTexts);
});

test.each([
  { input: 'a&amp;b', expectedNormalTexts: ['a&b'] },
  { input: 'a&lt;b', expectedNormalTexts: ['a<b'] },
  { input: 'a&gt;b', expectedNormalTexts: ['a>b'] },
  { input: '&quot;ab&quot;', expectedNormalTexts: ['"ab"'] },
  { input: '&#039;ab&#039;', expectedNormalTexts: ["'ab'"] },
  { input: 'ab&#8230;', expectedNormalTexts: ['ab...'] },
])('Unescape HTML: "$input"', testCase => {
  const textParts = partText(testCase.input);

  const normalTexts = textParts.parts.map(part => part.text);
  expect(normalTexts).toStrictEqual(testCase.expectedNormalTexts);
});

test.each([
  { input: '$123', expectedPrices: ['$123'] },
  { input: '$1.23', expectedPrices: ['$1.23'] },
  { input: '$2.00', expectedPrices: ['$2.00'] },
  { input: '$abc $123 def', expectedPrices: ['$123'] },
  { input: '$abc', expectedPrices: [] },
  { input: '$2.f', expectedPrices: ['$2'] },
  { input: '$2f', expectedPrices: ['$2'] },
  { input: '$.2', expectedPrices: [] },
  { input: '$0.2', expectedPrices: ['$0.2'] },
  { input: '$1 $2 abc $3', expectedPrices: ['$1', '$2', '$3'] },
  { input: '$10,000,000', expectedPrices: ['$10,000,000'] },
  { input: '$1k', expectedPrices: ['$1k'] },
  { input: '$1.23k', expectedPrices: ['$1.23k'] },
  { input: '$k', expectedPrices: [] },
])('Prices: "$input"', testCase => {
  const textParts = partText(testCase.input);

  const prices = textParts.parts.filter(part => part.type === 'price').map(part => part.text);
  expect(prices).toStrictEqual(testCase.expectedPrices);
});

test.each([
  {
    input: '<a class="external" href="https://www.example.com/">abc</a>',
    expectedLinkTexts: ['abc'],
    expectedUrls: ['https://www.example.com/'],
  },
  {
    input:
      'abc 123 <a class="external" href="https://www.example.com/">def</a> and then <a class="external" href="https://www.example2.com/">def2</a>',
    expectedLinkTexts: ['def', 'def2'],
    expectedUrls: ['https://www.example.com/', 'https://www.example2.com/'],
  },
  {
    input: '<a class="internal" href="/some-page">abc</a>',
    expectedLinkTexts: ['abc'],
    expectedUrls: [`${INTERNAL_LINK_PREFIX}/some-page`],
  },
  {
    // Has no closing tag, not a proper link.
    input: '<a class="internal" href="/some-page">abc',
    expectedLinkTexts: [],
    expectedUrls: [],
  },
])('Links: "$input"', testCase => {
  const textParts = partText(testCase.input);

  const linkTexts = textParts.parts.filter(part => part.type === 'link').map(part => part.text);
  const urls = textParts.parts.filter(part => part.type === 'link').map(part => part.url);

  expect(linkTexts).toStrictEqual(testCase.expectedLinkTexts);
  expect(urls).toStrictEqual(testCase.expectedUrls);
});

test.each([
  { input: 'abc <blockquote>def</blockquote> ghi', expectedQuoteTexts: ['def'] },
  { input: '<blockquote>def</blockquote> <blockquote>ghi</blockquote>', expectedQuoteTexts: ['def', 'ghi'] },
  // Closing tag is missing "</", not a proper blockquote.
  { input: '<blockquote>def<blockquote>', expectedQuoteTexts: [] },
  { input: '<blockquote>abc $123</blockquote>', expectedQuoteTexts: ['abc $123'] },
])('Blockquotes: "$input"', testCase => {
  const textParts = partText(testCase.input);

  const prices = textParts.parts.filter(part => part.type === 'blockquote').map(part => part.text);
  expect(prices).toStrictEqual(testCase.expectedQuoteTexts);
});

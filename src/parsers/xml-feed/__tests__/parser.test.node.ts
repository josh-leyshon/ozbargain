import { convertToOzbargainFeed } from '../parser';
import { invalidFixtures, parseRssFeedFromString, validFixtures } from './fixtures/getFixtures';

describe('Valid fixtures', () => {
  test.each(validFixtures)(
    'Fixture: $name',
    async ({ rawFixture, parsedFixture }) => {
      const feed = await parseRssFeedFromString(rawFixture);
      const convertedFeed = convertToOzbargainFeed(feed);

      expect(JSON.stringify(convertedFeed)).toEqual(parsedFixture);
    },
  );
});

describe('Invalid fixtures', () => {
  test.each(invalidFixtures)('Fixture: $name', async ({ rawFixture }) => {
    const feed = await parseRssFeedFromString(rawFixture);
    expect(() => convertToOzbargainFeed(feed)).toThrow();
  });
});

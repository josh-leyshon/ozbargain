import { convertToOzbargainFeed } from '../parser';
import { fixtures, parseRssFeedFromString } from './getFixtures';

describe('Valid fixtures', () => {
  test.each(fixtures)(
    'Fixture: $name',
    async ({ rawFixture, parsedFixture }) => {
      const feed = await parseRssFeedFromString(rawFixture);
      const convertedFeed = convertToOzbargainFeed(feed);

      expect(JSON.stringify(convertedFeed)).toEqual(parsedFixture);
    },
  );
});

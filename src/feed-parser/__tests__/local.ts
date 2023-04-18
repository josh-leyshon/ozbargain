import { readFile } from 'fs/promises';
import type { OzbargainFeed } from '../parser';
import { convertToOzbargainFeed } from '../parser';
import { parseRssFeedFromString } from './getFixtures';

export async function getOzbargainFeedFromFile(
  file: string,
): Promise<OzbargainFeed> {
  return convertToOzbargainFeed(
    await parseRssFeedFromString(await readFile(file, 'utf-8')),
  );
}

const TEST_FEED_FILE = `${__dirname}/__tests__/fixtures/ozbargain-rss.xml`;

async function main() {
  console.log(await getOzbargainFeedFromFile(TEST_FEED_FILE));
}
main().catch((err: unknown) => {
  throw err;
});

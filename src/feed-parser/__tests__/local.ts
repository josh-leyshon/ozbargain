import { readFile } from 'fs/promises';
import type { OzbargainFeed } from '../parser';
import { convertToOzbargainFeed } from '../parser';
import { parseRssFeedFromString } from './getFixtures';

const FEED_FIXTURE = `${__dirname}/__tests__/fixtures/valid/ozbargain-rss.xml`;

export async function getOzbargainFeedFromFile(
  file: string,
): Promise<OzbargainFeed> {
  return convertToOzbargainFeed(
    await parseRssFeedFromString(await readFile(file, 'utf-8')),
  );
}

async function main() {
  console.log(await getOzbargainFeedFromFile(FEED_FIXTURE));
}
main().catch((err: unknown) => {
  throw err;
});

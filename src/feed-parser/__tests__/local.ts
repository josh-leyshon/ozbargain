import { readFile } from 'fs/promises';
import type { OzbargainFeed } from '../parser';
import { convertToOzbargainFeed } from '../parser';
import { parseRssFeedFromString } from './fixtures/getFixtures';

export async function getOzbargainFeedFromFile(
  file: string,
): Promise<OzbargainFeed> {
  return convertToOzbargainFeed(
    await parseRssFeedFromString(await readFile(file, 'utf-8')),
  );
}

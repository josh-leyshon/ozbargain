/**
 * This file should be run locally with ts-node to regenerate valid fixtures.
 * Any .xml files in the fixtures/valid/ directory will be parsed and converted,
 * and matching .parsed.json files will be written to disk.
 */

import { writeFile } from 'fs/promises';
import { convertToOzbargainFeed } from '../parser';
import { parseRssFeedFromString, validFixtures } from './getFixtures';

const VALID_FIXTURES_DIR = `${__dirname}/fixtures/valid`;

// Will overwrite any existing file.
async function writeFileToDisk(
  contents: string,
  fileLocation: string,
): Promise<void> {
  // Sanity check to avoid overwriting random files on disk.
  if (!fileLocation.startsWith(VALID_FIXTURES_DIR)) {
    throw new Error(
      `Attempted to write file outside valid fixtures dir: ${fileLocation}`,
    );
  }

  return writeFile(fileLocation, contents);
}

async function main() {
  const parsedFeeds = await Promise.all(
    validFixtures.map(async ({ name, rawFixture }) => ({
      filename: name,
      feed: await parseRssFeedFromString(rawFixture),
    })),
  );

  const convertedFeeds = parsedFeeds.map(({ filename, feed }) => ({
    filename,
    convertedFeed: convertToOzbargainFeed(feed),
  }));

  await Promise.all(
    convertedFeeds.map(({ filename, convertedFeed }) =>
      writeFileToDisk(
        JSON.stringify(convertedFeed),
        `${VALID_FIXTURES_DIR}/${filename}.parsed.json`,
      ),
    ),
  );
}

main().catch((err: unknown) => {
  throw err;
});

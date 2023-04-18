import { readFileSync, readdirSync } from 'fs';
import type { RssFeed } from '../parser';
import { getRssParser } from '../parser';

const FIXTURES_DIR = `${__dirname}/fixtures`;
const VALID_FIXTURES_DIR = `${FIXTURES_DIR}/valid`;
const INVALID_FIXTURES_DIR = `${FIXTURES_DIR}/invalid`;

type Fixture = {
  /** Fixture filename without extension. */
  name: string;
  /** String contents of the raw fixture file (in XML format). */
  rawFixture: string;
};

type ValidFixture = Fixture & {
  /** String contents of the parsed fixture file (in parsed JSON format). */
  parsedFixture: string;
};

// Exported for use in local execution (manual testing).
export function parseRssFeedFromString(feedStr: string): Promise<RssFeed> {
  return getRssParser().parseString(feedStr);
}

function getParsedFixture(filename: string): string {
  // Parsed fixture files may be pretty-printed, so we re-stringify them.
  return JSON.stringify(JSON.parse(readFileSync(filename, 'utf-8')));
}

export const validFixtures: ValidFixture[] = (() => {
  const allFileNames = readdirSync(VALID_FIXTURES_DIR, {
    withFileTypes: true,
  })
    .filter(
      item =>
        item.isFile() &&
        (item.name.endsWith('.xml') || item.name.endsWith('.parsed.json')),
    )
    .map(file => file.name);

  const collectedFixtures: ValidFixture[] = [];

  allFileNames
    .filter(file => file.endsWith('.xml'))
    .forEach(rawFile => {
      const parsedFilename = allFileNames.find(
        file =>
          file.endsWith('.parsed.json') &&
          file.split('.')[0] === rawFile.split('.')[0],
      );

      if (!parsedFilename) {
        throw new Error(
          `Unable to find matching parsed fixture for raw feed fixture "${rawFile}"`,
        );
      }

      const rawFixture = readFileSync(
        `${VALID_FIXTURES_DIR}/${rawFile}`,
        'utf-8',
      );
      const parsedFixture = getParsedFixture(
        `${VALID_FIXTURES_DIR}/${parsedFilename}`,
      );

      collectedFixtures.push({
        name: rawFile.split('.')[0],
        rawFixture,
        parsedFixture,
      });
    });

  return collectedFixtures;
})();

export const invalidFixtures: Fixture[] = (() => {
  const filenames = readdirSync(INVALID_FIXTURES_DIR, {
    withFileTypes: true,
  })
    .filter(item => item.isFile() && item.name.endsWith('.xml'))
    .map(file => file.name);

  return filenames.map(file => ({
    name: file.split('.')[0],
    rawFixture: readFileSync(`${INVALID_FIXTURES_DIR}/${file}`, 'utf-8'),
  }));
})();

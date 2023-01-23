import { readFile } from "fs/promises";
import { convertToOzbargainFeed, getRssParser } from "./parser";

async function parseRssFeedFromFile(feedFile: string) {
  const fileStr = await readFile(feedFile, "utf-8");
  const feed = getRssParser().parseString(fileStr);

  return feed;
}

export async function getOzbargainFeedFromFile(file: string) {
  return convertToOzbargainFeed(await parseRssFeedFromFile(file));
}

const TEST_FEED_FILE = `${__dirname}/tests/fixtures/ozbargain-rss.xml`;

async function main() {
  console.log(await getOzbargainFeedFromFile(TEST_FEED_FILE));
}
main();

import type { CheerioAPI, Element, SelectorType } from 'cheerio';
import { load } from 'cheerio';
import { OZBARGAIN_BASE_URL } from '../../../base/constants/urls';
import type { PartedText } from '../../text/textParts';
import { partText } from '../../text/textParts';

export type Comment = {
  id: string;
  timestamp: Date;
  /**
   * Information about this comment's author.
   */
  user: {
    name: string;
    thumbnailUrl: string;
    profileUrl: string;
  };
  /**
   * The text content of the comment.
   */
  content: PartedText;
  /**
   * Votes are totalled, so a positive value is upvoted that amount,
   * and negative value is downvoted that amount.
   */
  votes: number;
  /**
   * How indented this comment is in a thread.
   *
   * Level 0 == A base comment on the deal,
   * Higher levels are replies to a `level - 1` comment.
   */
  level: number;
  /**
   * Any replies to this comment.
   */
  children?: Comment[];
};

function getCommentAndChildren(rootCheerio: CheerioAPI, comment: Element, level: number): Comment {
  const $ = (query: SelectorType) => rootCheerio(query, comment);

  const id = $('> div.comment-wrap').attr()?.['id']?.match(/comment-(\d+)/)?.at(1);
  const timestampMs = Number.parseInt($('> div.comment-wrap > div.comment').attr()?.['data-ts'] ?? '0') * 1000;
  if (!id) {
    throw new Error(`Did not find ID for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (timestampMs === 0) {
    throw new Error(`Did not find ID for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const userATag = $('> div.comment-wrap div.submitted a');
  const userName = userATag.text();
  const userLink = userATag.attr()?.href;
  const userThumbnailUrl = $('> div.comment-wrap div.n-left > img').attr()?.src;

  if (!userLink) {
    throw new Error(`Did not find comment author profile link for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (!userThumbnailUrl) {
    throw new Error(`Did not find comment author thumbnail URL for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const votes = Number.parseInt($('> div.comment-wrap span.cvc').text() || '0');

  const contentDiv = $('> div.comment-wrap div.content');
  const contentHtml = contentDiv.html()?.trim() ?? '';

  const children = $('> ul.comment > li').map((_, elem) => getCommentAndChildren(rootCheerio, elem, level + 1)).get();

  return {
    id,
    timestamp: new Date(timestampMs),
    user: {
      name: userName,
      thumbnailUrl: userThumbnailUrl,
      profileUrl: `${OZBARGAIN_BASE_URL}${userLink}`,
    },
    content: partText(contentHtml),
    votes,
    level,
    children,
  };
}

/**
 * Extract all comments on a deal info page.
 * @param html The HTML of a deal info page.
 */
export function getDealCommentsFromDocument(html: string) {
  const $ = load(html);
  const level0Comments = $('ul.comment.level0 > li');

  return level0Comments.map((_, elem) => getCommentAndChildren($, elem, 0)).get();
}

import type { CheerioAPI, Element, SelectorType } from 'cheerio';
import { load } from 'cheerio';
import { OZBARGAIN_BASE_URL } from '../../../base/constants/urls';
import type { PartedText } from '../../text/textParts';
import { partText } from '../../text/textParts';

type BaseCommentFields = {
  id: string;
  timestamp: Date;
  /**
   * The state of the comment.
   *
   * `shown` = Default, comment is normal.
   * `hidden` = Comment has been hidden due to too many negative votes.
   * `removed` = Comment has been removed by moderators.
   */
  state: 'shown' | 'hidden' | 'removed';
  /**
   * Information about this comment's author.
   */
  user: {
    name: string;
    thumbnailUrl: string;
    profileUrl: string;
    /**
     * This user is the original poster (OP) of the deal.
     */
    isOp: boolean;
  };
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

type CommentContentAndVotes = {
  /**
   * The text content of the comment.
   */
  content: PartedText;
  /**
   * Votes are totalled, so a positive value is upvoted that amount,
   * and negative value is downvoted that amount.
   */
  votes: number;
};

type ShownComment = BaseCommentFields & CommentContentAndVotes & {
  state: 'shown';
};

type HiddenComment =
  & BaseCommentFields
  & {
    state: 'hidden';
  }
  & {
    [K in keyof CommentContentAndVotes]?: never;
  };

type RemovedComment =
  & BaseCommentFields
  & {
    state: 'removed';
    id: `removed-${string}`;
    user: {
      name: 'Removed';
      thumbnailUrl: '';
      profileUrl: '';
      isOp: false;
    };
  }
  & {
    [K in keyof CommentContentAndVotes]?: never;
  };

export type Comment = ShownComment | HiddenComment | RemovedComment;

let randomIdSeed = 1;
// Adapted from: https://stackoverflow.com/a/19303725
function randomId() {
  const randomNumber = Math.sin(randomIdSeed++) * 10_000;
  const decimalPart = randomNumber - Math.floor(randomNumber);
  const id = Math.floor(decimalPart * 1_000_000_000);
  return id;
}

function makeRemovedComment(level: number, children: Comment[]): RemovedComment {
  return {
    state: 'removed',
    id: `removed-${randomId()}`,
    timestamp: new Date(0),
    user: {
      name: 'Removed',
      profileUrl: '',
      thumbnailUrl: '',
      isOp: false,
    },
    level,
    children,
  };
}

function getCommentAndChildren(rootCheerio: CheerioAPI, comment: Element, level: number): Comment {
  const $ = (query: SelectorType) => rootCheerio(query, comment);

  const commentExists = $('> div.comment-wrap').length > 0;
  if (!commentExists) {
    const children = $('> ul.comment > li')
      .map((_, elem) => getCommentAndChildren(rootCheerio, elem, level + 1))
      .get();

    return makeRemovedComment(level, children);
  }

  const id = $('> div.comment-wrap').attr()?.['id']?.match(/comment-(\d+)/)?.at(1);
  const timestampMs = Number.parseInt($('> div.comment-wrap > div.comment').attr()?.['data-ts'] ?? '0') * 1000;
  if (!id) {
    throw new Error(`Did not find ID for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (timestampMs === 0) {
    throw new Error(`Did not find timestamp for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const userATag = $('> div.comment-wrap div.comment a[href^="/user/"]');
  const userName = userATag.text();
  const userLink = userATag.attr()?.href;
  const userThumbnailUrl = $('> div.comment-wrap div.comment img[class="gravatar"]').attr()?.src;
  const isOp = $('> div.comment-wrap div.comment').hasClass('comment-op');

  if (!userLink) {
    throw new Error(`Did not find comment author profile link for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }
  if (!userThumbnailUrl) {
    throw new Error(`Did not find comment author thumbnail URL for comment. HTML:\n${$('> div.comment-wrap').html()}`);
  }

  const votes = Number.parseInt($('> div.comment-wrap span.cvc').text() || '0');

  const contentDiv = $('> div.comment-wrap div.content');
  const contentHtml = contentDiv.html()?.trim() ?? '';

  const state = $('> div.comment-wrap div.comment').hasClass('hidden') ? 'hidden' : 'shown';

  const children = $('> ul.comment > li')
    .map((_, elem) => getCommentAndChildren(rootCheerio, elem, level + 1))
    .get();

  return {
    id,
    timestamp: new Date(timestampMs),
    user: {
      name: userName,
      thumbnailUrl: userThumbnailUrl,
      profileUrl: `${OZBARGAIN_BASE_URL}${userLink}`,
      isOp,
    },
    level,
    children,
    ...(state === 'shown'
      ? {
        state,
        content: partText(contentHtml),
        votes,
      }
      : {
        state,
      }),
  };
}

/**
 * Extract all comments on a deal info page.
 * @param html The HTML of a deal info page.
 */
export function getDealCommentsFromDocument(html: string): Comment[] {
  const $ = load(html);
  const level0Comments = $('ul.comment.level0 > li');

  return level0Comments.map((_, elem) => getCommentAndChildren($, elem, 0)).get();
}

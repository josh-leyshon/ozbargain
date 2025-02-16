import { OZBARGAIN_BASE_URL } from '../../base/constants/urls';
import { UnreachableError } from '../../base/unreachableError';

type TextPartType = 'price' | 'link' | 'blockquote' | 'normal' | 'bold';
type InternalTextPartType = TextPartType | 'metaDiv';

type LinkTextPart = {
  type: 'link';
  url: string;
  /**
   * The text that should be displayed as the link. */
  text: string;
  /**
   * Whether this link is for an internal ozbargain page (eg. a deal, a comment, a user profile),
   * or a link to an external site. */
  linkType: 'internal' | 'external';
};

export type TextPart =
  & {
    /** Raw text of this Part. */
    rawText: string;
    /** Index of the entire string that this Part starts on, inclusive. */
    startIndex: number;
    /** Index of the entire string that this Part ends on, exclusive. */
    endIndex: number;
  }
  & ({
    type: Exclude<TextPartType, 'link'>;
    /** Text with HTML tags stripped out. */
    text: string;
  } | LinkTextPart);

/**
 * Text that has been parsed into interesting parts, in the order they appeared.
 */
export type PartedText = {
  rawText: string;
  parts: TextPart[];
};

const priceRegex = /(\$(?:\d+(?:,\d+)*(?:\.\d+)?k?))/;
const priceRegexBeginsWith = '$';

const descriptionMetaDivRegex = /(?:<div style="float:right;.+?<\/div>)/;
const descriptionMetaDivBeginsWith = '<div style="float:right';

const linkRegex = /(<a .+?>.+?<\/a>)/;
const linkRegexBeginsWith = '<a ';

const blockQuoteRegex = /(<blockquote>.+?<\/blockquote>)/;
const blockQuoteRegexBeginsWith = '<blockquote>';

const boldRegex = /(<strong>.+?<\/strong>)/;
const boldRegexBeginsWith = '<strong>';

const allRegexes = new RegExp(
  `${priceRegex.source}|${descriptionMetaDivRegex.source}|${linkRegex.source}|${blockQuoteRegex.source}|${boldRegex.source}`,
  'gs',
);

export function partText(input: string): PartedText {
  const parts: TextPart[] = [];
  let endIndexOfLastMatch = 0;

  for (const match of input.matchAll(allRegexes)) {
    const matchedText = match[0];
    const type = (
      matchedText.startsWith(priceRegexBeginsWith)
        ? 'price'
        : matchedText.startsWith(descriptionMetaDivBeginsWith)
        ? 'metaDiv'
        : matchedText.startsWith(linkRegexBeginsWith)
        ? 'link'
        : matchedText.startsWith(blockQuoteRegexBeginsWith)
        ? 'blockquote'
        : matchedText.startsWith(boldRegexBeginsWith)
        ? 'bold'
        : undefined
    ) satisfies InternalTextPartType | undefined;

    if (!type) {
      console.error(`Found unknown match type when parsing text.`, {
        inputText: input,
        match,
      });
      continue;
    }

    const matchStartIndex = match.index;
    const matchEndIndex = match.index + matchedText.length;

    if (type === 'metaDiv') {
      // We want to ignore the initial meta div in a deal description.
      endIndexOfLastMatch = matchEndIndex;
      continue;
    }

    const textPartBeforeThisMatch = {
      type: 'normal',
      rawText: input.slice(endIndexOfLastMatch, matchStartIndex),
      text: stripAndUnescapeHtml(input.slice(endIndexOfLastMatch, matchStartIndex)),
      startIndex: endIndexOfLastMatch,
      endIndex: matchStartIndex,
    } satisfies TextPart;

    const matchedPart = parsePart(match, type, { start: matchStartIndex, end: matchEndIndex });
    if (!matchedPart) {
      console.error('Unable to create TextPart for match:', {
        inputText: input,
        type,
        match,
      });

      endIndexOfLastMatch = matchEndIndex;
      continue;
    }

    // If two matches occur next to each other there will be no normal text part in between,
    // and we would be pushing an empty string with overlapping start/end indexes
    // as the valid matches around it.
    // This can also happen if a match occurs at the start of the string.
    if (matchStartIndex !== endIndexOfLastMatch) {
      parts.push(textPartBeforeThisMatch);
    }
    parts.push(matchedPart);
    endIndexOfLastMatch = matchEndIndex;
  }

  const remainingTextPart = {
    type: 'normal',
    rawText: input.slice(endIndexOfLastMatch),
    text: stripAndUnescapeHtml(input.slice(endIndexOfLastMatch)),
    startIndex: endIndexOfLastMatch,
    endIndex: input.length,
  } satisfies TextPart;

  parts.push(remainingTextPart);

  return {
    rawText: input,
    parts,
  };
}

function parsePart(
  match: RegExpExecArray,
  type: Exclude<TextPartType, 'normal'>,
  indexes: { start: number; end: number },
): TextPart | undefined {
  switch (type) {
    case 'link': {
      const linkParts = parseLink(match[0]);
      return linkParts
        ? {
          type,
          rawText: match[0],
          startIndex: indexes.start,
          endIndex: indexes.end,
          ...linkParts,
        }
        : undefined;
    }
    case 'price':
    case 'bold':
      return {
        type,
        rawText: match[0],
        text: stripAndUnescapeHtml(match[0]),
        startIndex: indexes.start,
        endIndex: indexes.end,
      };
    case 'blockquote':
      return {
        type,
        rawText: match[0],
        text: stripAndUnescapeHtml(match[0])
          // Blockquotes always seem to start and end with newlines that weren't deliberately part of the written text.
          .trim(),
        startIndex: indexes.start,
        endIndex: indexes.end,
      };
    default:
      throw new UnreachableError(type);
  }
}

export const INTERNAL_LINK_PREFIX = OZBARGAIN_BASE_URL;

/**
 * Parse an `<a>` tag into parts.
 */
function parseLink(text: string): Omit<LinkTextPart, 'type'> | undefined {
  const urlStr = text.match(/href="(.+?)"/)?.[1];
  const relativeLink = urlStr?.startsWith('/');
  const linkText = text.match(/<a .+?>(.+?)<\/a>/s)?.[1];

  if (!urlStr || relativeLink === undefined || !linkText) {
    return;
  }

  const linkType: LinkTextPart['linkType'] = relativeLink ? 'internal' : 'external';
  const url = linkType === 'internal' ? `${INTERNAL_LINK_PREFIX}${urlStr}` : urlStr;

  return {
    url,
    text: linkText,
    linkType,
  };
}

function stripAndUnescapeHtml(text: string): string {
  return text
    // Remove HTML tags from given text, returning just the content text.
    .replaceAll(/(<([^>]+)>)/g, '')
    // Return escaped chars like `&amp;` to their normal forms (like `&`).
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&#8230;', '...');
}

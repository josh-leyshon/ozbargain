import Icon from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import type { TagProps } from '../../../base/components/tag/tag';
import { Tag } from '../../../base/components/tag/tag';
import { fontSizes } from '../../../base/constants/text';
import { Column, Row } from '../../../base/layout/flex';
import { getVotesIntensity } from '../../../base/votes/votesIntensity';
import type { Deal } from '../../../parsers/xml-feed/parser';

type ExpiryFormatter = (expiresAt: Deal['expiresAt']) => {
  text: string;
  colour: TagProps['colour'];
};
type DealMetaProps = Pick<Deal, 'author' | 'expiresAt' | 'commentCount' | 'votes'> & {
  expiryFormatter: ExpiryFormatter;
};

export function DealMeta(
  { author, expiresAt, commentCount, votes, expiryFormatter }: DealMetaProps,
): React.JSX.Element {
  const {
    text: expiresAtText,
    colour: expiresAtColour,
  } = expiryFormatter(expiresAt);

  const votesIntensity = getVotesIntensity(votes);
  const positiveVotesColour: TagProps['colour'] = votesIntensity.positive === 'intense' ? 'success' : 'normal';
  const negativeVotesColour: TagProps['colour'] = votesIntensity.negative === 'intense' ? 'error' : 'normal';

  return (
    <Column shrink={1} gap='medium' justifyContent='flex-end' alignItems='flex-start'>
      <Tag icon={<Icon name='alarm' size={fontSizes.medium} />} colour={expiresAtColour}>{expiresAtText}</Tag>
      <Tag
        // The person icon appears a bit smaller than the others.
        icon={<Icon name='person' size={fontSizes.large} />}
        colour='normal'
      >
        {author}
      </Tag>
      <Row gap='medium' justifyContent='flex-start' wrap='wrap'>
        <Tag icon={<Icon name='comment' size={fontSizes.medium} />} colour='normal'>{commentCount}</Tag>
        <Tag icon={<Icon name='thumb-up' size={fontSizes.medium} />} colour={positiveVotesColour}>{votes.positive}</Tag>
        <Tag icon={<Icon name='thumb-down' size={fontSizes.medium} />} colour={negativeVotesColour}>
          {votes.negative}
        </Tag>
      </Row>
    </Column>
  );
}

const formatShortDate: Intl.DateTimeFormat['format'] = date =>
  new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);

/**
 * Utility function to inject the current date into the default expiry formatter, useful for testing.
 * @param currentDate The current date, which will be used to determine how close a deal is to expiring.
 */
export const makeDefaultExpiryFormatter = (currentDate: Date): ExpiryFormatter => expiresAt => {
  const tomorrowDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

  const colour: TagProps['colour'] = expiresAt != null
    ? expiresAt < currentDate
      ? 'error'
      : (expiresAt < tomorrowDate)
      ? 'warning'
      : 'normal'
    : 'normal';

  const text = colour === 'error'
    ? 'Expired'
    : colour === 'warning'
    ? 'Today'
    : expiresAt
    ? formatShortDate(expiresAt)
    : 'Unknown';

  return {
    text,
    colour,
  };
};

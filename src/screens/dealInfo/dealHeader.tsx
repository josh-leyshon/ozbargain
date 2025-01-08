import type React from 'react';
import type { Deal } from '../../global-state/dealsFeed';
import { DealCard } from '../dealsFeed/dealCard/dealCard';
import { DealMeta, makeDefaultExpiryFormatter } from '../dealsFeed/dealCard/dealMeta';

type DealHeaderProps = Pick<
  Deal,
  'title' | 'author' | 'thumbnailUrl' | 'postedAt' | 'expiresAt' | 'votes' | 'commentCount'
>;

export function DealHeader({
  title,
  author,
  postedAt,
  expiresAt,
  thumbnailUrl,
  votes,
  commentCount,
}: DealHeaderProps): React.JSX.Element {
  return (
    <DealCard
      title={title}
      imageUrl={thumbnailUrl}
      dealMeta={
        <DealMeta
          author={author}
          expiresAt={expiresAt}
          commentCount={commentCount}
          votes={votes}
          expiryFormatter={makeDefaultExpiryFormatter(new Date())}
        />
      }
    />
  );
}

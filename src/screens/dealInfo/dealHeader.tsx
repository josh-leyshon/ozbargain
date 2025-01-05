import { SquareImage } from '../../base/components/image/squareImage';
import { Text } from '../../base/components/text/text';
import { Column, Row } from '../../base/layout/flex';
import type { OzbargainFeed } from '../../feed-parser/parser';
import { makeVoteButtons } from './voteButtons';

type DealHeaderProps = {
  title: string;
  imageUrl?: string;
  author: string;
  postedAt: Date;
  expiresAt?: Date;
  votes: OzbargainFeed['deals'][number]['votes'];
};

export function DealHeader({
  title,
  author,
  postedAt,
  expiresAt,
  imageUrl,
  votes,
}: DealHeaderProps): React.JSX.Element {
  const { positiveVoteButton, negativeVoteButton } = makeVoteButtons({ votes });

  return (
    <Row gap='large'>
      <Column gap='large' shrink={1} grow={1}>
        <Text size='large'>{title}</Text>
        <Row gap='large' alignItems='flex-end' wrap='wrap'>
          <Column>
            <Text colour='light'>Posted by @{author}</Text>
            <Text colour='light'>
              {postedAt.toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })} {postedAt.toLocaleTimeString(undefined, {
                timeStyle: 'short',
              })}
            </Text>
          </Column>
          <Text colour='light'>
            {'Expires:\n'}
            {expiresAt?.toLocaleDateString(undefined, {
              dateStyle: 'medium',
            }) ?? 'Unknown'}
          </Text>
        </Row>
      </Column>
      <Column gap='large' justifyContent='flex-start'>
        <SquareImage source={{ uri: imageUrl }} sizePx={140} />
        <Row gap='large'>
          {positiveVoteButton}
          {negativeVoteButton}
        </Row>
      </Column>
    </Row>
  );
}

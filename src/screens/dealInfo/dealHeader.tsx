import { StyleSheet, Text } from 'react-native';
import { SquareImage } from '../../base/components/image/squareImage';
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
    <Row gap={16}>
      <Column gap={16} shrink={1} grow={1}>
        <Text style={textStyles.title}>{title}</Text>
        <Row gap={16} alignItems='flex-end' wrap='wrap'>
          <Column>
            <Text style={textStyles.light}>Posted by @{author}</Text>
            <Text style={textStyles.light}>
              {postedAt.toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })} {postedAt.toLocaleTimeString(undefined, {
                timeStyle: 'short',
              })}
            </Text>
          </Column>
          <Text style={textStyles.light}>
            {'Expires:\n'}
            {expiresAt?.toLocaleDateString(undefined, {
              dateStyle: 'medium',
            }) ?? 'Unknown'}
          </Text>
        </Row>
      </Column>
      <Column gap={16} justifyContent='flex-start'>
        <SquareImage source={{ uri: imageUrl }} sizePx={140} />
        <Row gap={16}>
          {positiveVoteButton}
          {negativeVoteButton}
        </Row>
      </Column>
    </Row>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  light: {
    color: 'grey',
  },
});

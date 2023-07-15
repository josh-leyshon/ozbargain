import { Button } from '../../base/components/button/button';
import type { OzbargainFeed } from '../../feed-parser/parser';

type VoteButtonsProps = {
  votes: OzbargainFeed['deals'][number]['votes'];
};
type OnPress = {
  onPress: () => Promise<void>;
};

// TODO: When the app supports logging in, add API call here to submit a vote.
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
const submitVote = async (kind: 'positive' | 'negative') => undefined;

export function makeVoteButtons({ votes }: VoteButtonsProps): {
  positiveVoteButton: JSX.Element;
  negativeVoteButton: JSX.Element;
} {
  return {
    positiveVoteButton: PositiveVoteButton({
      ...votes,
      onPress: () => submitVote('positive'),
    }),
    negativeVoteButton: NegativeVoteButton({
      ...votes,
      onPress: () => submitVote('negative'),
    }),
  };
}

function PositiveVoteButton({
  positive,
  onPress,
}: VoteButtonsProps['votes'] & OnPress): JSX.Element {
  const title = `👍 ${positive}`;
  return <Button title={title} color="green" onPress={onPress} />;
}

function NegativeVoteButton({
  negative,
  onPress,
}: VoteButtonsProps['votes'] & OnPress): JSX.Element {
  const title = `👎 ${negative}`;
  return <Button title={title} color="lightRed" onPress={onPress} />;
}

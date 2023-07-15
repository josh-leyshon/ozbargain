import type { ButtonColours } from '../../base/components/button/button';
import { Button } from '../../base/components/button/button';
import type { OzbargainFeed } from '../../feed-parser/parser';

type VoteButtonsProps = {
  votes: OzbargainFeed['deals'][number]['votes'];
};
type OnPress = {
  onPress: () => Promise<void>;
};
type VoteKind = 'positive' | 'negative';

// TODO: When the app supports logging in, add API call here to submit a vote.
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
const submitVote = async (kind: VoteKind) => undefined;

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

function getColourForVoteCount(kind: VoteKind, count: number): ButtonColours {
  if (kind === 'positive') {
    // Thresholds decided based on personal experience with how often deals are positively voted.
    // eslint-disable-next-line no-nested-ternary, prettier/prettier
    return count < 5
        ? 'veryLightGreen'
        : count < 30
            ? 'lightGreen'
            : 'green';
  }
  // Negative votes are very rare on deals, so the thresholds are much lower.
  // eslint-disable-next-line no-nested-ternary, prettier/prettier
  return count < 1
      ? 'veryLightRed'
      : count < 3
          ? 'lightRed'
          : 'red';
}

function PositiveVoteButton({
  positive,
  onPress,
}: VoteButtonsProps['votes'] & OnPress): JSX.Element {
  const title = `👍 ${positive}`;
  const colour = getColourForVoteCount('positive', positive);
  return <Button title={title} color={colour} onPress={onPress} />;
}

function NegativeVoteButton({
  negative,
  onPress,
}: VoteButtonsProps['votes'] & OnPress): JSX.Element {
  const title = `👎 ${negative}`;
  const colour = getColourForVoteCount('negative', negative);
  return <Button title={title} color={colour} onPress={onPress} />;
}

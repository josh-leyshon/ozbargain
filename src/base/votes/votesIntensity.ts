import type { OzbargainFeed } from '../../feed-parser/parser';

type Votes = OzbargainFeed['deals'][number]['votes'];
type VoteKind = keyof Votes;
type VoteIntensity = 'normal' | 'intense';

// Thresholds decided based on personal experience with how often deals are voted.
const voteThresholds = {
  positive: 30,
  // Negative votes are very rare on deals, so the threshold is much lower.
  negative: 2,
} satisfies Record<VoteKind, number>;

/**
 * Votes are 'intense' if their counts are above or below certain thresholds.
 * They are 'normal' otherwise.
 * This is used to colour the display of vote counts.
 *
 * @param votes The votes to calculate for.
 * @param thresholds Optional, change the thresholds used to calculate intensity. Used for testing.
 */
export function getVotesIntensity(votes: Votes, thresholds = voteThresholds): Record<VoteKind, VoteIntensity> {
  return {
    positive: votes.positive >= thresholds.positive ? 'intense' : 'normal',
    negative: votes.negative >= thresholds.negative ? 'intense' : 'normal',
  };
}

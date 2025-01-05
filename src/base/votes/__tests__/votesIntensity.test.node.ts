import { getVotesIntensity } from '../votesIntensity';

const thresholds = {
  positive: 5,
  negative: 3,
};

test.each([
  { votes: { positive: 0, negative: 0 } },
  { votes: { positive: -1, negative: -1 } },
  { votes: { positive: 4, negative: 2 } },
])('Votes are normal when under the threshold', ({ votes }) => {
  expect(getVotesIntensity(votes, thresholds)).toStrictEqual({ positive: 'normal', negative: 'normal' });
});

test.each([
  { votes: { positive: 5, negative: 3 } },
  { votes: { positive: 50, negative: 30 } },
])('Votes are intense when over the threshold', ({ votes }) => {
  expect(getVotesIntensity(votes, thresholds)).toStrictEqual({ positive: 'intense', negative: 'intense' });
});

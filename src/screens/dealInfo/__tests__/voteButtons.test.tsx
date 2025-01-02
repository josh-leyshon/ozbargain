import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { expectButtonColour } from '../../../base/components/button/__tests__/testHelpers';
import { NegativeVoteButton, PositiveVoteButton } from '../voteButtons';

describe('Buttons change colour based on amount of votes', () => {
  const onPress = jest.fn();

  test('Positive votes', () => {
    render(
      <>
        <PositiveVoteButton votes={0} onPress={onPress} />
        <PositiveVoteButton votes={5} onPress={onPress} />
        <PositiveVoteButton votes={30} onPress={onPress} />
      </>,
    );

    const buttons = screen.getAllByText('👍', { exact: false });

    expectButtonColour(buttons[0], 'veryLightGreen');
    expectButtonColour(buttons[1], 'lightGreen');
    expectButtonColour(buttons[2], 'green');
  });

  test('Negative votes', () => {
    render(
      <>
        <NegativeVoteButton votes={0} onPress={onPress} />
        <NegativeVoteButton votes={1} onPress={onPress} />
        <NegativeVoteButton votes={3} onPress={onPress} />
      </>,
    );

    const buttons = screen.getAllByText('👎', { exact: false });

    expectButtonColour(buttons[0], 'veryLightRed');
    expectButtonColour(buttons[1], 'lightRed');
    expectButtonColour(buttons[2], 'red');
  });
});

describe('onPress fires with correct vote kind', () => {
  test('Positive vote button', () => {
    const onPress = jest.fn();
    render(<PositiveVoteButton votes={0} onPress={onPress} />);

    const button = screen.getByText('👍', { exact: false });
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledWith('positive');
  });

  test('Negative vote button', () => {
    const onPress = jest.fn();
    render(<NegativeVoteButton votes={0} onPress={onPress} />);

    const button = screen.getByText('👎', { exact: false });
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledWith('negative');
  });
});

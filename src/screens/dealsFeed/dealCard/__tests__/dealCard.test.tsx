import { render, screen, fireEvent } from '@testing-library/react-native';
import { DealCard, DEAL_CARD_TEST_ID } from '../dealCard';

test('Pressing anywhere on the card fires onPress', () => {
  const onPress = jest.fn();
  const descriptionText = 'desc';

  render(
    <DealCard title="title" description={descriptionText} onPress={onPress} />,
  );

  const description = screen.getByText(descriptionText);
  const card = screen.getByTestId(DEAL_CARD_TEST_ID);

  fireEvent.press(description);
  fireEvent.press(card);

  expect(onPress).toHaveBeenCalledTimes(2);
});

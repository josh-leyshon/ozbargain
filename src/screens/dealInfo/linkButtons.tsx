import { Button } from '../../base/components/button/button';
import { Column, Row } from '../../base/layout/flex';

type LinkButtonProps = {
  onPressGoToDeal: () => void;
  onPressOpenOnOzbargain: () => void;
  onPressShare: () => void;
};

export function LinkButtons({
  onPressGoToDeal,
  onPressOpenOnOzbargain,
  onPressShare,
}: LinkButtonProps): React.JSX.Element {
  return (
    <Column gap='medium'>
      <Button title='Go to deal' colour='primary' onPress={onPressGoToDeal} />
      <Row gap='medium'>
        <Button
          title='Open on Ozbargain'
          colour='primary'
          onPress={onPressOpenOnOzbargain}
          fitContent
        />
        <Button title='Share' colour='primary' onPress={onPressShare} fitContent />
      </Row>
    </Column>
  );
}

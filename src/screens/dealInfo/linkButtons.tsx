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
      <Button title='Go to deal' color='orange' onPress={onPressGoToDeal} />
      <Row gap='medium'>
        <Button
          title='Open on Ozbargain'
          color='orange'
          onPress={onPressOpenOnOzbargain}
          fitContent
        />
        <Button title='Share' color='orange' onPress={onPressShare} fitContent />
      </Row>
    </Column>
  );
}

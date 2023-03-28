import { ArcIcon } from './icons/arc';
import { Spinner } from '../spinner/spinner';

const sizeToScale = {
  small: 1,
  medium: 1.5,
  large: 3,
} as const;

type LoadingProps = {
  /** Default: medium */
  size?: keyof typeof sizeToScale;
};

export function Loading({ size }: LoadingProps): JSX.Element {
  return (
    <Spinner>
      <ArcIcon scaleSize={sizeToScale[size ?? 'medium']} />
    </Spinner>
  );
}

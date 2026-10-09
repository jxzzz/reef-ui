export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
}

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Button } from './Button';

afterEach(cleanup);

describe('Button', () => {
  test('triggers click event', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('loading blocks click and sets aria-busy', async () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('disabled blocks click', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Submit
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

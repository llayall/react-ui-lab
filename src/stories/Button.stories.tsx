import type { Meta, StoryObj } from '@storybook/react-vite'

const Button = ({ label, primary }: { label: string; primary?: boolean }) => (
  <button
    type="button"
    style={{
      backgroundColor: primary ? 'var(--color-primary-500)' : 'transparent',
      color: primary ? '#fff' : 'var(--color-primary-500)',
      border: '2px solid var(--color-primary-500)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-2) var(--space-4)',
      cursor: 'pointer',
      fontWeight: 500,
    }}
  >
    {label}
  </button>
)

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { label: 'Button', primary: true },
}

export const Secondary: Story = {
  args: { label: 'Button', primary: false },
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "shared/ui/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "버튼",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">버튼</Button>
      <Button size="md">버튼</Button>
      <Button size="lg">버튼</Button>
    </div>
  ),
};

export const VariantMatrix: Story = {
  parameters: { layout: "padded" },
  render: () => {
    const variants = ["primary", "secondary", "ghost"] as const;
    const sizes = ["sm", "md", "lg"] as const;
    return (
      <div className="inline-grid grid-cols-3 gap-3">
        {variants.map((variant) =>
          sizes.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant}/{size}
            </Button>
          )),
        )}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" disabled>
        버튼
      </Button>
      <Button variant="secondary" disabled>
        버튼
      </Button>
      <Button variant="ghost" disabled>
        버튼
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="w-80">
      <Button variant="primary" fullWidth>
        버튼
      </Button>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Button asChild>
      <a href="#">링크 버튼</a>
    </Button>
  ),
};

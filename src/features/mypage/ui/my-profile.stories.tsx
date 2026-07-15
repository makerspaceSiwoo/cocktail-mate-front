import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { User } from "@/entities/user";

import { MyProfile } from "./my-profile";
import { MyProfileError } from "./my-profile-error";
import { MyProfileSkeleton } from "./my-profile-skeleton";

const MOCK_USER: User = {
  id: 58,
  email: "cocktail_lover@example.com",
  nickname: "칵테일 러버",
  provider: "kakao",
  profile_image_url: "/images/cosmopolitan-example.jpg",
};

const meta: Meta<typeof MyProfile> = {
  title: "features/mypage/MyProfile",
  component: MyProfile,
  decorators: [
    (Story) => (
      <div className="bg-bg min-h-[932px] w-full max-w-[430px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MyProfile>;

export const Default: Story = {
  args: {
    user: MOCK_USER,
  },
};

export const WithoutProfileImage: Story = {
  args: {
    user: {
      ...MOCK_USER,
      profile_image_url: null,
    },
  },
};

export const WithoutEmail: Story = {
  args: {
    user: {
      ...MOCK_USER,
      email: null,
    },
  },
};

export const LongProfile: Story = {
  args: {
    user: {
      ...MOCK_USER,
      nickname: "칵테일을 사랑하는 아주 긴 닉네임의 사용자",
      email: "a-very-long-cocktail-lover-email@example.com",
    },
  },
};

export const Loading: Story = {
  render: () => <MyProfileSkeleton />,
};

export const Error: Story = {
  render: () => <MyProfileError onRetry={() => undefined} />,
};

export const Unauthorized: Story = {
  render: () => <MyProfileError unauthorized onRetry={() => undefined} />,
};

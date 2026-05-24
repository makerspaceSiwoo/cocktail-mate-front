import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "shared/ui/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultValue: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-80">
      <TabsList>
        <TabsTrigger value="home">홈</TabsTrigger>
        <TabsTrigger value="explore">탐색</TabsTrigger>
        <TabsTrigger value="my">마이</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-muted">홈 콘텐츠</p>
      </TabsContent>
      <TabsContent value="explore">
        <p className="text-muted">탐색 콘텐츠</p>
      </TabsContent>
      <TabsContent value="my">
        <p className="text-muted">마이 콘텐츠</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-80">
      <TabsList>
        <TabsTrigger value="home">홈</TabsTrigger>
        <TabsTrigger value="explore">탐색</TabsTrigger>
        <TabsTrigger value="search">검색</TabsTrigger>
        <TabsTrigger value="cocktail">칵테일</TabsTrigger>
        <TabsTrigger value="my">마이</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-muted">홈 콘텐츠</p>
      </TabsContent>
      <TabsContent value="explore">
        <p className="text-muted">탐색 콘텐츠</p>
      </TabsContent>
      <TabsContent value="search">
        <p className="text-muted">검색 콘텐츠</p>
      </TabsContent>
      <TabsContent value="cocktail">
        <p className="text-muted">칵테일 콘텐츠</p>
      </TabsContent>
      <TabsContent value="my">
        <p className="text-muted">마이 콘텐츠</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-80">
      <TabsList>
        <TabsTrigger value="home">홈</TabsTrigger>
        <TabsTrigger value="explore" disabled>
          탐색
        </TabsTrigger>
        <TabsTrigger value="my">마이</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-muted">홈 콘텐츠</p>
      </TabsContent>
      <TabsContent value="explore">
        <p className="text-muted">탐색 콘텐츠</p>
      </TabsContent>
      <TabsContent value="my">
        <p className="text-muted">마이 콘텐츠</p>
      </TabsContent>
    </Tabs>
  ),
};

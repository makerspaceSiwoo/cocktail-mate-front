import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import { Card, CardBody, CardFooter, CardHeader } from "./card";

const meta: Meta<typeof Card> = {
  title: "shared/ui/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardBody>
          <p className="text-text text-sm">
            기본 카드 — 헤더와 푸터 없이 본문만 사용할 수 있습니다.
          </p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <h3 className="text-text text-lg font-semibold">버진 모히토</h3>
        </CardHeader>
        <CardBody>
          <p className="text-muted text-sm">
            라임과 민트의 상큼한 향이 어우러진 무알콜 칵테일입니다.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="ghost" size="sm">
            담기
          </Button>
          <Badge>Non-alcoholic</Badge>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Cocktail: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <div className="bg-banner-bg aspect-[4/3]" />
        <CardHeader>
          <h3 className="text-text text-lg font-semibold">버진 모히토</h3>
        </CardHeader>
        <CardBody>
          <p className="text-muted text-sm">
            라임과 민트의 상큼한 향이 어우러진 무알콜 칵테일입니다.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="ghost" size="sm">
            담기
          </Button>
          <Badge>Non-alcoholic</Badge>
        </CardFooter>
      </Card>
    </div>
  ),
};

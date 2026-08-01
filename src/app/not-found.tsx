import { ErrorView } from "@/shared/ui/error-view";

export default function NotFound() {
  return (
    <ErrorView
      code="404"
      title="페이지를 찾을 수 없어요"
      description="요청하신 페이지가 없거나 주소가 변경되었어요."
    />
  );
}

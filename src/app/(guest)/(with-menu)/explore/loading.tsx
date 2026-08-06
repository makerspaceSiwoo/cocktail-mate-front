/** ExploreView 의 SceneFallback 과 같은 자리·문구로 3D 씬 영역을 잡아둔다. */
export default function ExploreLoading() {
  return (
    <main
      className="bg-bg relative flex min-h-0 w-full flex-1 flex-col overflow-hidden"
      aria-busy="true"
    >
      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          role="status"
          className="text-muted flex h-full w-full items-center justify-center px-6 text-center text-sm"
        >
          탐색 데이터를 불러오는 중…
        </div>
      </div>

      <div className="text-muted shrink-0 px-4 pt-2 pb-3 text-xs leading-5">
        <p className="text-center">구체를 회전 및 확대하여 자유롭게 탐색해보세요.</p>
        <p className="text-center">가까이 모여있는 칵테일은 맛이 비슷한 칵테일입니다.</p>
      </div>
    </main>
  );
}

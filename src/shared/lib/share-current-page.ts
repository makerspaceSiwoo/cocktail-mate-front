/**
 * 현재 페이지를 공유한다.
 *
 * - Web Share API 지원 시 네이티브 공유 시트를 연다 (반환 false).
 * - 미지원 시 현재 URL 을 클립보드에 복사한다 (반환 true → "복사됨" 안내용).
 */
export async function shareCurrentPage(title: string): Promise<boolean> {
  const shareData = { title, url: window.location.href };

  if (navigator.share) {
    await navigator.share(shareData);
    return false;
  }

  await navigator.clipboard.writeText(shareData.url);
  return true;
}

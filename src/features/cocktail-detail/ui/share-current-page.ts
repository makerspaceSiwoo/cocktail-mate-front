export async function shareCurrentPage(title: string) {
  const shareData = { title, url: window.location.href };

  if (navigator.share) {
    await navigator.share(shareData);
    return false;
  }

  await navigator.clipboard.writeText(shareData.url);
  return true;
}

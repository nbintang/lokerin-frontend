export const isValidImageUrl = (url: string | null | undefined) => {
  if (!url) return false;

  try {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const lowerUrl = url.toLowerCase();
    return validExtensions.some((ext) => lowerUrl.endsWith(ext));
  } catch {
    return false;
  }
};

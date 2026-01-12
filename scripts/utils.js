export const optimizeImage = (url, width = 800, additionalParams = '') => {
  if (!url) return '';
  // Ensure we are using https
  const secureUrl = url.startsWith('//') ? `https:${url}` : url;
  
  // Return optimized URL
  // w = width
  // fm = format (webp is best for web)
  // q = quality (80 is standard)
  const baseParams = `w=${width}&fm=webp&q=80`;
  return additionalParams ? `${secureUrl}?${baseParams}&${additionalParams}` : `${secureUrl}?${baseParams}`;
}

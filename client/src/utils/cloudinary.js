/**
 * Optimizes Cloudinary URLs by adding auto-format and auto-quality parameters.
 * @param {string} url The original cloudinary URL
 * @returns {string} The optimized URL
 */
export const optimizeCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // If already contains transformations, just return
  if (url.includes('/upload/f_auto,q_auto')) return url;

  // Insert f_auto,q_auto after /upload/
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};


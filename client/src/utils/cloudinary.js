/**
 * Optimizes Cloudinary URLs by adding auto-format and auto-quality parameters.
 * @param {string} url The original cloudinary URL
 * @returns {string} The optimized URL
 */
export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // Replace existing transformations or add new ones
  // We look for /upload/ and replace it with /upload/f_auto,q_auto,w_{width}/
  // If f_auto already exists, we still replace it to ensure the width is applied
  const transformation = `f_auto,q_auto,w_${width}`;
  
  if (url.includes('/upload/')) {
    // Safely insert transformations right after /upload/
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  return url;
};


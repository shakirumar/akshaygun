// Image path utility for files served from the public folder
export const getImagePath = (imageName) => {
  if (!imageName) return '';

  // If it's already a full URL, return as is
  if (imageName.startsWith('http')) {
    return imageName;
  }

  // Serve local filenames from the public folder
  if (imageName.startsWith('/')) {
    return imageName;
  }

  return encodeURI(`/${imageName}`);
};

export const getProductImagePath = (imageName) => {
  return getImagePath(imageName);
};

const DICEBEAR_BASE_URI = 'https://api.dicebear.com/7.x/shapes';

export const generateImageUri = (slug: string) => {
  return DICEBEAR_BASE_URI + '/svg?seed=' + slug;
};

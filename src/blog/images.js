import imageData from './imageData.json';

export const imagesFor = post => (imageData[post?.key] || []).map(image => ({
  ...image,
  url: `/assets/images/blog/${post.key}/${image.name}`,
}));

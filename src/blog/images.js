import imageData from './imageData.json';

const files = import.meta.glob('../assets/images/blog/*/*.webp', { eager: true, import: 'default' });

export const imagesFor = post => imageData[post.key].map(image => ({
  ...image,
  url: files['../assets/images/blog/' + post.key + '/' + image.name],
}));

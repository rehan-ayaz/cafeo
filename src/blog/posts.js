import { food } from './food.js';
import { drinksAndDesserts } from './drinksAndDesserts.js';
import { experience } from './experience.js';
import { additions } from './additions.js';
import { servingNotes } from './servingNotes.js';

export const categories = {
  'food': 'Food',
  'desserts': 'Desserts',
  'coffee-hot-beverages': 'Coffee & Hot Beverages',
  'cold-beverages': 'Cold Beverages',
  'cafe-experience': 'Café Experience',
};

export const posts = [...food, ...drinksAndDesserts, ...experience].map(post => {
  const sections = [...post.sections.slice(0, -1), ...additions[post.key], post.sections.at(-1)].map((section, index) =>
    index === post.sections.length - 1 && servingNotes[post.key] ? [...section, servingNotes[post.key]] : section
  );
  return {
    ...post,
    sections,
    categoryKey: Object.keys(categories).find(key => categories[key] === post.category),
    published: '2026-11-24',
    minutes: Math.ceil([post.intro, ...sections.flat()].join(' ').split(/\s+/).length / 220),
  };
});

export const postPath = post => '/blog/' + post.slug;
export const categoryPath = post => '/blog?category=' + post.categoryKey;
export const sectionId = heading => heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

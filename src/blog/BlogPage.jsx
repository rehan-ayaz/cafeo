import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCafeo } from '../hooks/useCafeo';
import BlogShell from './BlogShell';
import { categories, posts, categoryPath, postPath, sectionId } from './posts';
import { useBlogHead } from './useBlogHead';
import { imagesFor } from './images';
import { menuItems } from '../menuCatalog';
import MenuItemGrid from '../components/MenuItemGrid';
import { articleTips } from './articleTips';
import './blog.css';

const pageSize = 6;

const formatDate = date => new Intl.DateTimeFormat('en', {
  dateStyle: 'long', timeZone: 'UTC',
}).format(new Date(date + 'T00:00:00Z'));

function Photo({ image, eager = false, className }) {
  return <img className={className} src={image.url} alt={image.alt} width={image.width}
    height={image.height} loading={eager ? 'eager' : 'lazy'}
    fetchPriority={eager ? 'high' : undefined} decoding="async" />;
}

function PostDetails({ post, author = false }) {
  return <p className="cafeo-blog-details">
    {author && <span>Cafeo Team</span>}
    <time dateTime={post.published}>{formatDate(post.published)}</time>
    {post.updated && <span>Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>}
    <span>{post.minutes} min read</span>
  </p>;
}

function Card({ post, featured = false }) {
  const Heading = featured ? 'h2' : 'h3';
  return <article className={'cafeo-blog-card' + (featured ? ' cafeo-blog-featured' : '')}>
    <a className="cafeo-blog-card-link" href={postPath(post)}>
      <Photo image={imagesFor(post)[0]} eager={featured} />
      <div className="cafeo-blog-card-content">
        <p className="cafeo-blog-category">{featured ? 'Featured · ' : ''}{post.category}</p>
        <Heading>{post.title}</Heading>
        <p>{post.description}</p>
        <PostDetails post={post} />
        <span className="cafeo-blog-read">Read more <span aria-hidden="true">→</span></span>
      </div>
    </a>
  </article>;
}

function ButtonLink({ href, children }) {
  return <a className="btn-block w-inline-block" href={href}>
    <span className="btn-text">{children}</span>
    <span className="btn-border-block" aria-hidden="true">
      <span className="border-top btn-border-line-white" />
      <span className="border-right btn-border-line-white" />
      <span className="border-bottom btn-border-line-white" />
      <span className="border-left btn-border-line-white" />
    </span>
  </a>;
}

function Listing() {
  const [params, setParams] = useSearchParams();
  const category = Object.hasOwn(categories, params.get('category')) ? params.get('category') : '';
  const query = params.get('q') || '';
  const filterKey = category + ':' + query;
  const [more, setMore] = useState({ filterKey, count: pageSize });
  const visible = more.filterKey === filterKey ? more.count : pageSize;
  const normalized = query.trim().toLowerCase();
  const filtered = posts.filter(post => (!category || post.categoryKey === category) &&
    [post.title, post.category, post.description, post.keyword, ...post.secondary].join(' ').toLowerCase().includes(normalized));
  const updateFilter = (name, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(name, value) : next.delete(name);
    setMore({ filterKey: '', count: pageSize });
    setParams(next, { replace: name === 'q', preventScrollReset: true });
  };
  const allCategories = Object.entries(categories).filter(([key]) => posts.some(post => post.categoryKey === key));
  return <main>
    <section className="pagetitle-section cafeo-blog-banner">
      <div className="container w-container">
        <p className="page-pretitle-text">Cafeo Journal</p>
        <div className="pagetitle-grid">
          <h1 className="pagetitle-heading">The Cafeo Blog</h1>
          <p className="pagetitle-desc">Find your next café order, discover drink and dessert pairings, and plan a visit with friends.</p>
        </div>
      </div>
    </section>
    <section className="cafeo-blog-section container w-container" aria-labelledby="all-articles">
      {!category && !normalized && <Card post={posts[0]} featured />}
      <h2 id="all-articles">Explore the articles</h2>
      <div className="cafeo-blog-filters">
        <label className="cafeo-blog-search">Search articles
          <input type="search" value={query} onChange={event => updateFilter('q', event.target.value)} placeholder="Search food, coffee or café guides" />
        </label>
        <nav aria-label="Blog categories" className="cafeo-blog-categories">
          <button type="button" aria-pressed={!category} onClick={() => updateFilter('category', '')}>All articles</button>
          {allCategories.map(([key, label]) => <button key={key} type="button" aria-pressed={category === key} onClick={() => updateFilter('category', key)}>{label}</button>)}
        </nav>
      </div>
      <p className="cafeo-blog-result" role="status">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p>
      {filtered.length ? <div className="cafeo-blog-grid">
        {filtered.slice(0, visible).map(post => <Card post={post} key={post.slug} />)}
      </div> : <p>Try a different search or category.</p>}
      {visible < filtered.length && <button className="cafeo-blog-more" type="button" onClick={() => setMore({ filterKey, count: visible + pageSize })}>Load more articles</button>}
    </section>
  </main>;
}

function Breadcrumbs({ post }) {
  return <nav aria-label="Breadcrumb" className="cafeo-blog-breadcrumbs">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href={categoryPath(post)}>{post.category}</a></li>
      <li><a href={postPath(post)} aria-current="page">{post.title}</a></li>
    </ol>
  </nav>;
}

const contextLinks = {
  breakfast: ['/blog/coffee-types-explained', 'Compare café coffee styles'],
  starters: ['/blog/choosing-the-perfect-main-course', 'Choose a main course to follow'],
  burgers: ['/blog/delicious-cafe-starters', 'Find a starter to share'],
  pizza: ['/blog/delicious-cafe-starters', 'Find an appetizer for the table'],
  'main-course': ['/blog/refreshing-mocktails-guide', 'Explore non-alcoholic drink pairings'],
  cakes: ['/blog/coffee-types-explained', 'Compare coffees for dessert'],
  waffles: ['/blog/cakes-cheesecakes-and-brownies', 'Compare other café desserts'],
  coffee: ['/blog/ultimate-cafe-breakfast-guide', 'Find a breakfast for your coffee'],
  mocha: ['/blog/cakes-cheesecakes-and-brownies', 'Choose a dessert to pair'],
  'iced-coffee': ['/blog/coffee-types-explained', 'Explore espresso-based classics'],
  juices: ['/blog/refreshing-mocktails-guide', 'Compare clear, sparkling mocktails'],
  mocktails: ['/blog/juices-smoothies-and-milkshakes', 'Compare other fruit-based drinks'],
  'cafe-date': ['/gallery', 'See the Café gallery'],
  dining: ['/about-us', 'Get to know Cafeo'],
};

function SectionPhotos({ images }) {
  return <div className={'cafeo-blog-inline-photos' + (images.length === 2 ? ' cafeo-blog-photo-pair' : '')}>
    {images.map(image => <Photo key={image.name} image={image} />)}
  </div>;
}

function Article({ post }) {
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    setActiveSection('');
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-10% 0px -65% 0px' });
    document.querySelectorAll('.cafeo-blog-prose h2[id]').forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [post.slug]);
  const selectSection = (event, id) => {
    // Let native anchor scrolling handle this link without the legacy scroll animation.
    event.stopPropagation();
    setActiveSection(id);
  };
  const [hero, main, support1, support2, detail, lifestyle] = imagesFor(post);
  const imagesBySection = [[main], [support1, support2], [detail], [lifestyle]];
  const related = post.related.map(key => posts.find(candidate => candidate.key === key));
  const [contextHref, contextLabel] = contextLinks[post.key];
  const contact = post.categoryKey === 'cafe-experience';
  return <main className="cafeo-blog-article-page">
    <section className="pagetitle-section cafeo-blog-post-banner">
      <div className="container w-container">
      <Breadcrumbs post={post} />
      <header className="cafeo-blog-article-header">
        <a className="cafeo-blog-category" href={categoryPath(post)}>{post.category}</a>
        <h1>{post.title}</h1>
        <p className="cafeo-blog-excerpt">{post.description}</p>
        <PostDetails post={post} author />
      </header>
      </div>
    </section>
    <div className="container w-container">
    <article>
      <Photo image={hero} eager className="cafeo-blog-hero" />
      <div className="cafeo-blog-prose">
        <p className="cafeo-blog-intro">{post.intro}</p>
        <nav className="cafeo-blog-toc" aria-label="Table of contents">
          <p>In this article</p>
          <ol>{post.sections.map(([heading]) => <li key={heading}><a href={'#' + sectionId(heading)} aria-current={activeSection === sectionId(heading) ? 'location' : undefined} onClick={event => selectSection(event, sectionId(heading))}>{heading}</a></li>)}<li><a href="#before-you-order" aria-current={activeSection === 'before-you-order' ? 'location' : undefined} onClick={event => selectSection(event, 'before-you-order')}>Before you order</a></li><li><a href="#menu-highlights" aria-current={activeSection === 'menu-highlights' ? 'location' : undefined} onClick={event => selectSection(event, 'menu-highlights')}>From the Cafeo menu</a></li></ol>
        </nav>
        {post.sections.map(([heading, ...paragraphs], index) => <section key={heading}>
          <h2 id={sectionId(heading)}>{heading}</h2>
          {paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          {imagesBySection[index] && <SectionPhotos images={imagesBySection[index]} />}
          {index === post.sections.length - 2 && <p><a href={contextHref}>{contextLabel} →</a></p>}
        </section>)}
        <section>
          <h2 id="before-you-order">Before you order</h2>
          <ul>{articleTips[post.key].map(tip => <li key={tip}>{tip}</li>)}</ul>
        </section>
      </div>
        <section className="cafeo-blog-highlights" aria-labelledby="menu-highlights">
          <h2 id="menu-highlights">From the Cafeo menu</h2>
          <MenuItemGrid items={post.menu.map(title => menuItems.find(item => item.title === title)).filter(Boolean)} />
        </section>
        <div className="cafeo-blog-cta">
          <ButtonLink href="/menu">Explore Our Menu</ButtonLink>
          {contact && <ButtonLink href="/reservations">Make a Reservation</ButtonLink>}
        </div>
    </article>
    <section className="cafeo-blog-related" aria-labelledby="related-articles">
      <h2 id="related-articles">Related articles</h2>
      <div className="cafeo-blog-grid">{related.map(item => <Card key={item.key} post={item} />)}</div>
    </section>
    <a className="cafeo-blog-back" href="/blog">← Back to All Articles</a>
    </div>
  </main>;
}

function MissingPost() {
  return <main className="pagetitle-section cafeo-blog-missing"><div className="container w-container">
    <h1>Article not found</h1>
    <p>Browse the Cafeo journal to find a guide.</p>
    <ButtonLink href="/blog">Back to All Articles</ButtonLink>
  </div></main>;
}

export default function BlogPage() {
  const { slug } = useParams();
  const post = posts.find(item => item.slug === slug);
  const missing = Boolean(slug && !post);
  const title = post ? post.seo + ' | Cafeo' : missing ? 'Article not found | Cafeo' : 'Café Food, Coffee & Dining Guides | Cafeo Blog';
  useCafeo('680b6cd71381ca4ebe9b01f7', title);
  useBlogHead({ post, title, missing, image: post ? imagesFor(post)[0] : imagesFor(posts[0])[0] });
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [slug]);
  return <BlogShell>{post ? <Article post={post} /> : missing ? <MissingPost /> : <Listing />}</BlogShell>;
}

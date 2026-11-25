import { imagesFor } from './images';
import { posts, postPath } from './posts';

const formatDate = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default function ArticleGrid({ className, limit }) {
  return <div className="w-dyn-list">
    <div role="list" className={className + ' w-dyn-items'}>
      {posts.slice(0, limit).map(post => {
        const image = imagesFor(post)[0];
        return <div role="listitem" className="w-dyn-item" key={post.slug}>
          <article className="blog-item-link-block">
            <div className="blog-thumbnail-main">
              <a className="blog-thumbnail" href={postPath(post)} tabIndex={-1} aria-hidden="true">
                <img className="blog-image" src={image.url} alt="" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="blog-content-block">
              <div className="blog-meta-block">
                <time className="blog-meta-text" dateTime={post.published}>
                  {formatDate.format(new Date(post.published + 'T00:00:00Z'))}
                </time>
                <span aria-hidden="true">|</span>
                <span className="blog-meta-text">{post.category}</span>
              </div>
              <a className="blog-item-title" href={postPath(post)}>{post.title}</a>
            </div>
          </article>
        </div>;
      })}
    </div>
  </div>;
}

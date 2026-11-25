import { Link, Navigate, useParams } from 'react-router-dom';
import ArticleGrid from '../blog/ArticleGrid';
import { useCafeo } from '../hooks/useCafeo';
import { team, teamImage } from '../teamCatalog';
import SiteShell from './SiteShell';

export function TeamRoster({ heading = 'Meet the Cafeo Team' }) {
  return <section className="team-1-section section-padding-100">
    <div className="container w-container">
      <div className="section-title center-text">
        <p className="section-pretitle">The People Behind Cafeo</p>
        <h2 className="section-heading">{heading}</h2>
      </div>
      <div className="cafeo-team-grid">
        {team.map(member => <article key={member.slug} className="cafeo-team-card">
          <Link to={'/team/' + member.slug}>
            <img src={teamImage(member)} alt="" loading="lazy" decoding="async" />
            <h3>{member.name}</h3>
          </Link>
          <p>{member.role}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

export function TeamProfile() {
  const { slug } = useParams();
  const key = slug.replace(/\.html$/, '');
  const member = team.find(person => person.slug === key || person.legacy === key);
  useCafeo('681c92e27d521ddced92cea', member ? member.name + ' | Cafeo' : 'Team | Cafeo', 'body');

  if (!member) return <Navigate to="/team" replace />;
  if (slug !== member.slug) return <Navigate to={'/team/' + member.slug} replace />;

  return <SiteShell>
    <main>
      <section className="pagetitle-section">
        <div className="container w-container">
          <p className="page-pretitle-text">Cafeo Team</p>
          <div className="pagetitle-grid">
            <h1 className="pagetitle-heading">{member.name}</h1>
            <p className="pagetitle-desc">{member.role}</p>
          </div>
        </div>
      </section>
      <section className="section-padding-100">
        <div className="container w-container cafeo-team-profile">
          <img src={teamImage(member)} alt={member.name} />
          <div>
            <p className="section-pretitle">{member.role}</p>
            <h2 className="section-heading">About {member.name}</h2>
            <p>{member.bio}</p>
            <Link to="/team" className="btn-block w-inline-block">Meet the Team</Link>
          </div>
        </div>
      </section>
      <section className="team-post-section section-bottom-padding-100">
        <div className="container w-container">
          <h2 className="section-heading">From the Cafeo Journal</h2>
          <ArticleGrid className="blog-1-grid" limit={3} />
        </div>
      </section>
    </main>
  </SiteShell>;
}

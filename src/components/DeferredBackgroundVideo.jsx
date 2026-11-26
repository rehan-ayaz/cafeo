import { useEffect, useRef, useState } from 'react';

export default function DeferredBackgroundVideo({ children, ...props }) {
  const video = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setNearViewport(true);
    }, { rootMargin: '1200px' });
    observer.observe(video.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (nearViewport) video.current.load();
  }, [nearViewport]);

  return <video {...props} ref={video} preload={nearViewport ? undefined : 'none'}>
    {nearViewport && children}
  </video>;
}

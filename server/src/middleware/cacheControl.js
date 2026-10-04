/** Lets browsers and CDNs cache public portfolio reads for a short time. */
export const cacheFor = (seconds) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`);
  next();
};

export const noStore = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};

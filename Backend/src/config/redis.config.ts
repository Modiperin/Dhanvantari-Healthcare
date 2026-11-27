export default {
  base: 'redis:',
  elastiCacheURL: process.env.ELASTI_CACHE_URL,
  elastiCachePort: process.env.ELASTI_CACHE_PORT || ''
}

import { createClient } from 'redis'

export const redis = await createClient({
  url: process.env.REDIS_URL,
})
  .on('error', (error) => console.error('Redis client error:', error))
  .connect()

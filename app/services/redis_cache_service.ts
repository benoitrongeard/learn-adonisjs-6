import redis from '@adonisjs/redis/services/main'

class RedisCacheService {
  async has(...keys: string[]) {
    return redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  }

  async set(key: string, value: any) {
    return await redis.set(key, JSON.stringify(value))
  }

  async delete(...keys: string[]) {
    return await redis.del(keys)
  }

  async flushDb() {
    return await redis.flushdb()
  }
}

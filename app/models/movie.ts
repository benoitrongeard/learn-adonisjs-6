import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import MovieService from '#services/movie_service'
import { toHtml } from '@dimerapp/markdown/utils'
import cache from '#services/cache_service'

// export default class Movie extends BaseModel {
//   @column({ isPrimary: true })
//   declare id: number

//   @column.dateTime({ autoCreate: true })
//   declare createdAt: DateTime

//   @column.dateTime({ autoCreate: true, autoUpdate: true })
//   declare updatedAt: DateTime
// }

export default class Movie {
  declare title: string

  declare slug: string

  declare summary: string

  declare abstract?: string

  static async findAll() {
    const slugs = await MovieService.getSlugs()
    const movies: Movie[] = []
    for (const slug of slugs) {
      const movie = await Movie.find(slug)
      movies.push(movie)
    }
    return movies
  }

  static async find(slug: string) {
    if (cache.has(slug)) {
      console.log('cache hit')
      return cache.get(slug)
    }

    const mdFile = await MovieService.read(slug)
    const movie = new Movie()
    movie.abstract = toHtml(mdFile).contents
    movie.title = mdFile.frontmatter.title
    movie.summary = mdFile.frontmatter.summary
    movie.slug = slug

    cache.set(slug, movie)

    return movie
  }
}

import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { toHtml } from '@dimerapp/markdown/utils'

export default class MoviesController {
  async index({ view }: HttpContext) {
    const slugs = await MovieService.getSlugs()
    const movies: Record<string, any> = []
    for (const slug of slugs) {
      const md = await MovieService.read(slug)
      movies.push({
        title: md.frontmatter.title,
        summary: md.frontmatter.summary,
        slug,
      })
    }
    return view.render('pages/home', { movies })
  }

  async show({ view, params }: HttpContext) {
    const mdFile = await MovieService.read(params.slug)
    const movie = toHtml(mdFile).contents
    return view.render('pages/movies/show', { movie })
  }
}

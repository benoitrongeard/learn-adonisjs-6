/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import MovieService from '#services/movie_service'
import router from '@adonisjs/core/services/router'
import { toHtml } from '@dimerapp/markdown/utils'

router
  .get('/', async (ctx) => {
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
    return ctx.view.render('pages/home', { movies })
  })
  .as('home')

router
  .get('/movies/:slug', async (ctx) => {
    const mdFile = await MovieService.read(ctx.params.slug)
    const movie = toHtml(mdFile).contents
    ctx.view.share({ movie })
    return ctx.view.render('pages/movies/show')
  })
  .as('movies.show')
  .where('slug', router.matchers.slug())

import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import { MarkdownFile } from '@dimerapp/markdown'
import fs from 'node:fs/promises'

export default class MovieService {
  static getSlugUrl(slug: string) {
    if (!slug.endsWith('.md')) {
      slug = `${slug}.md`
    }

    return app.makeURL(`resources/movies/${slug}`)
  }

  static async getSlugs() {
    const files = await fs.readdir('resources/movies')
    return files.map((file) => file.replace('.md', ''))
  }

  static async read(slug: string) {
    try {
      const url = this.getSlugUrl(slug)
      const content = await fs.readFile(url, 'utf8')
      const md = new MarkdownFile(content)
      await md.process()
      return md
    } catch (error) {
      throw new Exception(`Could not find a movie called ${slug}`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
  }
}

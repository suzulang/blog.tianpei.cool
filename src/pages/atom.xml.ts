import rss from '@astrojs/rss';
import { getPosts } from '~/utils';
import { THEME_CONFIG } from "~/theme.config";
import type { APIContext } from 'astro';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

const { title, desc, website, author } = THEME_CONFIG


export async function GET(_context: APIContext) {
  const posts = await getPosts()
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img'])
  return rss({
    title: title,
    description: desc,
    site: website,
    customData: `
      <follow_challenge>
        <feedId>69900580664822784</feedId>
        <userId>58768111003275264</userId>
      </follow_challenge>
    `,
    items: posts.map((post) => {
      return {
        link: `/posts/${post.slug}/`,
        author: author,
        content: sanitizeHtml(parser.render(post.body), { allowedTags, }),
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        customData: post.data.customData,
        categories: post.data.categories,
        commentsUrl: post.data.commentsUrl,
        source: post.data.source,
        enclosure: post.data.enclosure, 
        
      }
    }),
    stylesheet: '/pretty-feed-v3.xsl',
  });
}

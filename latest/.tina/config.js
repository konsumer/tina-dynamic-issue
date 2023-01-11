import { defineConfig, defineSchema } from 'tinacms'
import sm from 'slugify'

const slugify = s => sm(s || '', { strict: true, lower: true })

const dateFormat = d => (new Date(d)).toISOString().split('T').at(0)

// derive the intial slug from title
let blogTouched = false

const schema = defineSchema({
  collections: [
    {
      label: 'Page Content',
      name: 'page',
      path: 'content/page',
      format: 'mdx',
      fields: [
        {
          name: 'body',
          label: 'Main Content',
          type: 'rich-text',
          isBody: true
        }
      ],
      ui: {
        router: ({ document }) => {
          if (document._sys.filename === 'home') {
            return '/'
          }
          return undefined
        }
      }
    },
    {
      label: 'Blog Posts',
      name: 'post',
      path: 'content/post',
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
          isTitle: true,
          required: true,
          ui: {
            // derive the intial slug from title
            validate: (value, allValues, meta, field) => {
              if (value) {
                if (!blogTouched && document.location.hash === '#/collections/post/new') {
                  allValues.slug = slugify(value)
                }
              } else {
                return 'Title is required.'
              }
            }
          }
        },
        {
          type: 'string',
          label: 'Blog Post Body',
          name: 'body',
          isBody: true,
          ui: {
            component: 'textarea'
          }
        },
        {
          name: 'slug',
          label: 'URL Slug',
          type: 'string',

          ui: {
            validate: (value, allValues, meta, field) => {
              if (!value) {
                return 'Slug is required.'
              }
            },

            // tell title validate that thsi field was hand-edited
            parse (value) {
              blogTouched = true
              return value
            }
          }
        },
        {
          name: 'date',
          label: 'Date Created',
          type: 'datetime',
          required: true
        }
      ],
      defaultItem: () => {
        return {
          // When a new post is created the title field will be set to "New post"
          title: 'New Post',
          date: (new Date()).toISOString()
        }
      },
      ui: {
        router: ({ document }) => {
          // XXX: this is incorrect, I want the route to come from the slug, not the filename
          // but there is no document.slug
          return `/posts/${document._sys.filename}`
        },

        // this works fine to make the intiial filename
        filename: {
          readonly: true,
          slugify: (allValues) => `${dateFormat(allValues.date)}-${allValues.slug}`
        }
      }
    }
  ]
})

export const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch env
    process.env.HEAD, // Netlify branch env
  token: process.env.TINA_TOKEN,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads'
    }
  },
  build: {
    publicFolder: 'public', // The public asset folder for your framework
    outputFolder: 'admin' // within the public folder
  },
  schema
})

export default config

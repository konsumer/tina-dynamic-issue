import { Layout } from '../../components/Layout'
import { useTina } from 'tinacms/dist/react'
import { client } from '../../.tina/__generated__/client'

export default function Home (props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data
  })

  return (
    <Layout>
      <code>
        <pre
          style={{
            backgroundColor: 'lightgray'
          }}
        >
          {JSON.stringify(data.post, null, 2)}
        </pre>
      </code>
    </Layout>
  )
}

// export const getStaticPaths = async () => {
//   const { data } = await client.queries.postConnection();
//   const paths = data.postConnection.edges.map((x) => {
//     return { params: { slug: x.node._sys.filename } };
//   });
//
//   return {
//     paths,
//     fallback: "blocking",
//   };
// };
//
// export const getStaticProps = async (ctx) => {
//   const { data, query, variables } = await client.queries.post({
//     relativePath: ctx.params.slug + ".md",
//   });
//
//   return {
//     props: {
//       data,
//       query,
//       variables,
//     },
//   };
// };

// query to just get all the slugs
export const ALL_BLOG_SLUGS = `
query ALL_BLOG_SLUGS {
  postConnection(last: -1 ) {
    edges {
      node {
        slug
      }
    }
  }
}
`

// generate a list of all possible slug-values
export const getStaticPaths = async () => {
  const { data } = await client.request({ query: ALL_BLOG_SLUGS })
  const paths = data.postConnection.edges.map((x) => {
    return { params: { slug: x.node.slug } }
  })

  return {
    paths,
    fallback: false
  }
}

// search for post with slug, and load that
export const getStaticProps = async (ctx) => {
  const r = await client.queries.postConnection({ filter: { slug: { eq: ctx.params.slug } } })
  if (!r?.data?.postConnection?.edges?.length) {
    return {
      notFound: true
    }
  }

  const { data, query, variables } = await client.queries.post({ relativePath: (r.data.postConnection.edges).pop()?.node?._sys?.relativePath })

  return {
    props: {
      data,
      query,
      variables
    }
  }
}

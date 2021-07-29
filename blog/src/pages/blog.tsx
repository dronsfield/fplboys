import { graphql, PageProps } from "gatsby"
import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import PostHeader from "../components/postHeader"
import SEO from "../components/seo"
import { rem } from "../misc"

const Article = styled.article``
const ListItem = styled.li`
  margin-bottom: ${rem(2.5)};
`

const BlogIndex = (props: PageProps) => {
  const { data, location } = props
  const siteTitle = data?.site.siteMetadata?.title
  const posts = data?.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          return (
            <ListItem key={post.fields.slug}>
              <Article itemScope itemType="http://schema.org/Article">
                <PostHeader
                  frontmatter={post.frontmatter}
                  slug={post.fields.slug}
                />
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </Article>
            </ListItem>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          author
          gw
          season
        }
      }
    }
  }
`

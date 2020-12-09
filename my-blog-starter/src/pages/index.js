import { graphql, Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import colors from "../misc/colors"
import fonts from "../misc/fonts"

const Title = styled.h2`
  font-family: ${fonts.sans};
  text-transform: uppercase;
  color: ${colors.purple};
  margin: 0;
  font-size: 24px;
  margin-bottom: 6px;
`

const Author = styled.h3`
  font-family: ${fonts.sans};
  font-size: 32px;
  margin: 0;
  margin-bottom: 16px;
`

const Article = styled.article`
`
const ListItem = styled.li`
  margin-bottom: 40px;
`

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          // const title = post.frontmatter.title || post.fields.slug
          const { gw, season, author } = post.frontmatter
          // const title = `GW${gw} by ${author}`
          const title = `Gameweek ${gw}`

          return (
            <ListItem key={post.fields.slug}>
              <Article
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <Title>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </Title>
                    <Author itemProp="author">{author}</Author>
                  {/* <small>{post.frontmatter.date}</small> */}
                </header>
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

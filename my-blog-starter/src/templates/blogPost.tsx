import { graphql, Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import PostHeader from "../components/postHeader"
import SEO from "../components/seo"
import { colors, fonts } from "../misc"

const AdjacentLink = styled(Link)`
  color: ${colors.purple};
  font-family: ${fonts.sans};
  font-weight: bold;
`

const Arrow = styled.div<{ direction: "left" | "right" }>`
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  vertical-align: unset;
  ${props => {
    const styleDirection = props.direction === "left" ? "right" : "left"
    return `
  border: 0em solid transparent;
  border-${styleDirection}-color: currentColor;
  border-${styleDirection}-width: 0.6em;
  border-top-width: 0.3em;
  border-bottom-width: 0.3em;
  margin-${styleDirection}: 0.2em;`
  }}
`

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <PostHeader frontmatter={post.frontmatter} />
          {/* <p>{post.frontmatter.date}</p> */}
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <AdjacentLink to={previous.fields.slug} rel="prev">
                <Arrow direction="left" /> GW{previous.frontmatter.gw}
              </AdjacentLink>
            )}
          </li>
          <li>
            {next && (
              <AdjacentLink to={next.fields.slug} rel="next">
                GW{next.frontmatter.gw} <Arrow direction="right" />
              </AdjacentLink>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        description
        author
        gw
        season
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        gw
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        gw
      }
    }
  }
`

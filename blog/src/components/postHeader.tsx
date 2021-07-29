import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import { colors, fonts, mobileMq, rem } from "../misc"

const PostLink = styled(Link)`
  display: block;
  margin-bottom: ${rem(1)};
`

const Title = styled.h2`
  font-family: ${fonts.sans};
  text-transform: uppercase;
  color: ${colors.purple};
  margin: 0;
  margin-bottom: ${rem(0.4)};
  font-size: ${rem(1.5)};
  ${mobileMq} {
    font-size: ${rem(1.2)};
  }
`

const Author = styled.h3`
  font-family: ${fonts.sans};
  margin: 0;
  font-size: ${rem(2)};
  ${mobileMq} {
    font-size: ${rem(1.6)};
  }
`

const PostHeader: React.FC<{
  frontmatter: { gw: number; author: string }
  slug?: string
  className?: string
}> = props => {
  const {
    frontmatter: { gw, author },
    slug,
    className,
  } = props
  const title = `Gameweek ${gw}`
  return (
    <header>
      <PostLink to={"/blog" + slug} itemProp="url" className={className}>
        <Title itemProp="headline" children={title} />
        <Author itemProp="author" children={author} />
      </PostLink>
    </header>
  )
}

export default PostHeader

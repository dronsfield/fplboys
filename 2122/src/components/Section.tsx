import styled from "styled-components"

const SectionOuter = styled.div`
  padding: 16px 12px;
  flex: 1;
  &:nth-child(2n) {
    background-color: #fafafa;
  }
`

const SectionInner = styled.div`
  margin: 0 auto;
  max-width: 500px;
`

const Section: React.FC<{}> = (props) => {
  const { children } = props
  return (
    <SectionOuter>
      <SectionInner>{children}</SectionInner>
    </SectionOuter>
  )
}

export default Section

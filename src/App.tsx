import React, { AnchorHTMLAttributes, DOMAttributes } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { ReactComponent as CopyIcon } from './copy-icon.svg'

const LEAGUE_CODE = '8k99z9'

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 1rem;
    font-family: sans-serif;
    margin: 0;
    padding-bottom: 1.5rem;
  }

  html {
    font-size: 16px;
  }

  *, *:before, *:after {
    box-sizing: border-box;

  }

  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`

const desktop = `@media (min-width: 600px)`

export const normalizeButton = `
  border: 0;
  background: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
`

export const normalizeInput = `
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
  text-align: left;
  appearance: none;
  border: 0;
  border-radius: 0;
  caret-color: auto;
  background-color: transparent;
  &::placeholder{}
  &::-ms-expand{}
  &:focus{}
`

const BannerContainer = styled.div`
  width: 100%;
  background-image: url('/images/pixel-overlay.png'),
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url('/images/banner-1.jpg');
  background-size: auto, auto, cover;
  background-image: url('/images/banner-1.jpg');
  background-size: cover;
  background-position: top center;
  max-height: 500px;
  min-height: 0;
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    display: block;
    padding-bottom: 60%;
  }
`

const BannerText = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  color: white;
  font-family: IBM Plex Mono, monospace;
  font-size: 5vw;
  transform: translate(0, -50%);
  text-align: center;
  text-shadow: 0px 0px 20px #000;
`

function Banner() {
  return (
    <BannerContainer>
      {/* <BannerText>F P L B O Y S</BannerText> */}
    </BannerContainer>
  )
}

const buttonHeight = '3rem'

const CodeBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #eee;
  font-size: 1.3rem;
  color: #777;
`

const CodeText = styled.div`
  flex: 1;
  text-align: center;
  font-family: IBM Plex Mono, monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  &:focus {
    border: 0;
    outline: 0;
  }
`

const CodeInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

const CopyButton = styled.button`
  ${normalizeButton};
  height: 3rem;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.05);
`

const ContentContainer = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 1.5rem;
  font-size: 1rem;
  ${desktop} {
    padding: 2rem;
  }
`

const AllContentContainer = styled(ContentContainer)`
  padding-left: 0;
  padding-right: 0;
`

const Gutter = styled.div`
  ${desktop} {
    width: 0.8rem;
    height: 0.8rem;
  }
  width: 0.6rem;
  height: 0.6rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Button = styled.button<{ color?: string }>`
  ${normalizeButton};
  height: 3rem;
  line-height: 3rem;
  flex: 1;
  text-transform: uppercase;
  text-align: center;
  color: white;
  background-color: ${(props) => props.color || 'black'};
  text-decoration: none;
  font-family: IBM Plex Mono, monospace;
  letter-spacing: 0.05em;
  ${desktop} {
    font-size: 1.2rem;
  }
`

const TitleText = styled.div`
  font-family: IBM Plex Mono, monospace;
  font-weight: 500;
  font-size: 2rem;
  text-align: justify;
  text-align-last: justify;
  ${desktop} {
    font-size: 3rem;
  }
`

const SubTitleText = styled.div`
  font-size: 1.1rem;
  white-space: pre;
  text-align: center;

  ${desktop} {
    font-size: 1.4rem;
  }
`

const Link = (
  props: AnchorHTMLAttributes<DOMAttributes<HTMLAnchorElement>>
) => <Button as='a' target='_blank' {...props} />

function App() {
  return (
    <>
      <GlobalStyle />
      <div className='App'>
        <Banner />
      </div>
      <AllContentContainer>
        <ContentContainer>
          <TitleText children='F P L B O Y S' />
          {/* <div
          style={{ fontSize: 20, textAlign: 'center', fontWeight: 700 }}
          children='returns for the 20/21 season!'
        /> */}
          {/* <Gutter />
        <SubTitleText
          children={`Your favourite FPL league is\nback for the 20/21 season!`}
        /> */}
        </ContentContainer>
        <ContentContainer>
          <p>Your favourite FPL league is back for 20/21!</p>
          <p>Entry fee is £10. Prizepool distribution is TBC.</p>
          <p>Use the code or auto-join button below to get in.</p>
          <Gutter />
          <CodeBox>
            <CodeText children={LEAGUE_CODE} />
            <CodeInput
              id='league-code-text'
              readOnly
              type='text'
              value={LEAGUE_CODE}
              tabIndex={-1}
            />
            <CopyButton
              onClick={() => {
                const copyText = document.getElementById(
                  'league-code-text'
                ) as HTMLInputElement
                if (copyText) {
                  copyText.select()
                  document.execCommand('copy')
                  copyText.blur()
                  window.alert(`"${LEAGUE_CODE}" copied to clipboard`)
                }
              }}
            >
              <CopyIcon />
            </CopyButton>
          </CodeBox>
          <Gutter />
          <Row>
            <Link
              children='Auto-join'
              href={`https://fantasy.premierleague.com/leagues/auto-join/${LEAGUE_CODE}`}
            />
            <Gutter />
            <Link
              children='Payment'
              href='https://monzo.me/joshuadronsfield/10.00?d=FPL - Please put your name here'
            />
          </Row>
        </ContentContainer>
        <ContentContainer>
          <p>
            The first match of the season is on{' '}
            <strong>Saturday 12th September</strong> so make sure you've
            selected your team before then.
          </p>
          <p>
            Please put your name in the payment reference so we can tell who's
            paid.
          </p>
        </ContentContainer>
        <ContentContainer>
          <p>
            New to fantasy football? We use the official Fantasy Premier League.
          </p>
          <p>Here's some links to help you get started.</p>
          <Gutter />
          <Row>
            <Link
              children='Info'
              href='https://www.premierleague.com/news/1751439'
            />
            <Gutter />
            <Link
              children='Rules'
              href='https://fantasy.premierleague.com/help/rules'
            />
            <Gutter />
            <Link
              children='Sign up'
              href='https://fantasy.premierleague.com/'
            />
          </Row>
        </ContentContainer>{' '}
      </AllContentContainer>
    </>
  )
}

export default App

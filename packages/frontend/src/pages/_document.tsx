import { extractCritical } from '@emotion/server'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { Fragment, ReactFragment } from 'react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    const critical = extractCritical(initialProps.html)
    initialProps.html = critical.html
    initialProps.styles = (
      <Fragment>
        {initialProps.styles}
        <style
          data-emotion-css={critical.ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: critical.css }}
        />
      </Fragment>
    ) as any as ReactFragment
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* TODO Manifest & Favicons */}
          {/* TIP: Generate it at https://realfavicongenerator.net/ */}

          {/* Font(s) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

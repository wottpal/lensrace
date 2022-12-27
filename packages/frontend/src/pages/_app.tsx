import { ApolloProvider } from '@apollo/client'
import { BaseLayout } from '@components/layout/BaseLayout'
import { HotToastConfig } from '@components/layout/HotToastConfig'
import { cache } from '@emotion/css'
import { CacheProvider } from '@emotion/react'
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { env } from '@shared/environment'
import { lensApiClient } from '@shared/lensApi'
import { chains, wagmiClient } from '@shared/wagmiClient'
import GlobalStyles from '@styles/GlobalStyles'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import { theme } from 'twin.macro'
import { WagmiConfig } from 'wagmi'

// Router Loading Animation with @tanem/react-nprogress
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* SEO TODO */}
      <DefaultSeo
        dangerouslySetAllPagesToNoFollow={!env.isProduction}
        dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="lensrace.xyz"
        titleTemplate="%s | lensrace.xyz"
        description="On-chain follower competitions on Lens Protocol"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: env.url,
          site_name: 'lensrace.xyz',
          // images: [
          //   {
          //     url: `${env.url}/og/TODO.jpg`,
          //     width: 1200,
          //     height: 670,
          //   },
          // ],
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <CacheProvider value={cache}>
        <GlobalStyles />

        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={lightTheme({
              accentColor: theme('colors.primary'),
            })}
            coolMode={true}
            appInfo={{
              appName: 'lensrace.xyz',
            }}
          >
            <ApolloProvider client={lensApiClient}>
              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiConfig>

        <HotToastConfig />
      </CacheProvider>
    </>
  )
}

export default MyApp

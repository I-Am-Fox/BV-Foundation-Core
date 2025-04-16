import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TopNav from '../components/TopNav';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isLandingPage = router.pathname === '/';

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.png" type="image/png" />
                <title>Black Veil Foundation</title>
            </Head>

            {!isLandingPage && <TopNav />}
            <Component {...pageProps} />
        </>
    );
}

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import TopNav from '../components/TopNav';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isLandingPage = router.pathname === '/';

    return (
        <>
            {!isLandingPage && <TopNav />}
            <Component {...pageProps} />
        </>
    );
}

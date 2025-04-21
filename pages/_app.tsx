import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { AnimatePresence, motion } from 'framer-motion';

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

      <AnimatePresence mode="wait">
        <motion.div
          key={router.asPath}
          initial={{
            opacity: 0,
            filter: 'blur(6px) grayscale(100%) contrast(200%)',
            clipPath: 'inset(100% 0% 0% 0%)',
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px) grayscale(0%) contrast(100%)',
            clipPath: 'inset(0% 0% 0% 0%)',
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
            rotate: 1,
            skewX: 5,
            filter: 'contrast(400%) brightness(200%) hue-rotate(80deg) blur(4px)',
            clipPath: 'inset(30% 0% 40% 0%)',
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>

      {!isLandingPage && <Footer />}
    </>
  );
}

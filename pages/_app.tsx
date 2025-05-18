// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import GlitchTopNav from '../components/CTFComponents/TopNav';
import GlitchFooter from '../components/CTFComponents/Footer';

export default function App({
  Component,
  pageProps,
}: AppProps & { pageProps: { initialSession: any } }) {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const isClassifiedPage = router.pathname === '/classified';

  useEffect(() => {
    const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        try {
          await axios.post(
            'https://ecjkdjalxokhpcarjvzb.supabase.co/functions/v1/log-ip-address',
            {},
            { headers: { Authorization: `Bearer ${session.access_token}` } }
          );
          console.log('IP address logged successfully.');
        } catch (error) {
          console.error('Failed to log IP address:', error);
        }
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>Black Veil Foundation</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      {!isLandingPage && (isClassifiedPage ? <GlitchTopNav /> : <TopNav />)}

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

      {!isLandingPage && (isClassifiedPage ? <GlitchFooter /> : <Footer />)}
    </SessionContextProvider>
  );
}

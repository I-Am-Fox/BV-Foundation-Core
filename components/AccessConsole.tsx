
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessConsole() {
  const [accessing, setAccessing] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setAccessing(true);
    setTimeout(() => {
      router.push('/home');
    }, 4000); // Delay for animation before redirect
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
      <div className="text-center p-6">
        {!accessing ? (
          <>
            <h1 className="text-3xl mb-6">BLACK VEIL ACCESS TERMINAL</h1>
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-black font-bold rounded shadow-lg animate-pulse"
            >
              LOG IN
            </button>
          </>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 text-left max-w-md mx-auto"
            >
              <p>Establishing secure uplink...</p>
              <p>Verifying encryption keys...</p>
              <p>Running Black Veil access protocols...</p>
              <p className="text-green-300 font-bold">ACCESS GRANTED</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

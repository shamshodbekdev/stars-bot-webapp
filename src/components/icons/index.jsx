import { motion } from 'framer-motion';

// ===== Animatsiyali Gift Icon =====
export const AnimatedGift = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      rotate: [0, -5, 5, -5, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatDelay: 2,
    }}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </motion.svg>
);

// ===== Animatsiyali Star Icon =====
export const AnimatedStar = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      rotate: [0, 360],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </motion.svg>
);

// ===== Animatsiyali Crown Icon =====
export const AnimatedCrown = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      y: [0, -3, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path d="M2 20h20" />
    <path d="M5 20V8l3.5 3L12 4l3.5 7L19 8v12" />
  </motion.svg>
);

// ===== Animatsiyali Phone Icon =====
export const AnimatedPhone = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      rotate: [0, 15, -15, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
    }}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </motion.svg>
);

// ===== Animatsiyali Wallet Icon =====
export const AnimatedWallet = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      rotateY: [0, 15, 0, -15, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
    }}
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </motion.svg>
);

// ===== Animatsiyali Rocket Icon =====
export const AnimatedRocket = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      x: [0, 5, 0, -5, 0],
      y: [0, -3, 0, -3, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
    }}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </motion.svg>
);

// ===== Animatsiyali User Icon =====
export const AnimatedUser = ({ size = 32 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    }}
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </motion.svg>
);

// ===== Loading Spinner =====
export const Spinner = ({ size = 24, className = '' }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

// ===== Check Icon (success) =====
export const AnimatedCheck = ({ size = 24 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.path
      d="M20 6 9 17l-5-5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
  </motion.svg>
);

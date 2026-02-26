export const COLORS = {
  // Brand Colors
  primary: "#10B981", // Emerald Green - Main Brand Color (Peaceful, Spiritual)
  secondary: "#059669", // Darker Emerald - Accents/Active States
  accent: "#F59E0B", // Amber/Gold - Highlights (Premium feel)

  // Functional Colors
  background: "#F3F4F6", // Cool Light Gray - App Background
  surface: "#FFFFFF", // Pure White - Cards/Modals/Headers
  
  // Audio/Interactive
  audioPlaying: "#3B82F6", // Blue for playing state

  // Text
  textPrimary: "#111827", // Gray 900 - Headings (Sharp contrast)
  textSecondary: "#6B7280", // Gray 500 - Subtitles (Softer)
  textLight: "#9CA3AF", // Gray 400 - Placeholders/Disabled
  textInverse: "#FFFFFF", // White text on dark backgrounds

  // UI Elements
  border: "#E5E7EB", // Gray 200 - Dividers
  error: "#EF4444", // Red - Errors
  success: "#10B981", // Green - Success
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 16, // More rounded corners for modern feel
  padding: 20,
  margin: 20,

  // Font Sizes
  largeTitle: 32,
  h1: 26,
  h2: 22,
  h3: 18,
  h4: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
};

export const FONTS = {
  largeTitle: { fontSize: SIZES.largeTitle, fontWeight: 'bold', color: COLORS.textPrimary },
  h1: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.textPrimary },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.textPrimary },
  h3: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.textPrimary }, // Semi-bold for subsections
  h4: { fontSize: SIZES.h4, fontWeight: '600', color: COLORS.textPrimary },
  
  body1: { fontSize: SIZES.body1, lineHeight: 24, color: COLORS.textSecondary },
  body2: { fontSize: SIZES.body2, lineHeight: 20, color: COLORS.textSecondary },
  body3: { fontSize: SIZES.body3, lineHeight: 18, color: COLORS.textSecondary },
  
  btnText: { fontSize: SIZES.h3, fontWeight: '600', color: COLORS.white },
};

export const SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

const appTheme = { COLORS, SIZES, FONTS, SHADOWS };

export default appTheme;

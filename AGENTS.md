# Project rules

- Home hero logo background (`src/components/LogoMarquee.tsx`) computes its tilted rows at runtime from the hero size and each logo's aspect ratio (`src/components/logo-ratios.ts`), so no logo ever appears twice on screen. When adding or removing logo files, regenerate the ratio entries too, or widths are guessed and repeats can appear.

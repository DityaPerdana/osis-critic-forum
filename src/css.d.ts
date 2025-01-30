// css.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Add Tailwind CSS specific declarations
declare module 'tailwindcss' {
  export default function tailwindcss(): any;
}

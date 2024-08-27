const { RuleTester } = require("eslint");
const rule = require("../lib").rules["no-unsafe-client-side-usage"]; // Adjusted to import from the main index.js

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

ruleTester.run("no-unsafe-client-side-usage", rule, {
  valid: [
    {
      code: `if (typeof window !== 'undefined') { window.addEventListener('resize', () => {}); }`,
    },
    {
      code: `if (typeof document !== 'undefined') { document.getElementById('app'); }`,
    },
    {
      code: `if ('window' in globalThis) { console.log(window); }`,
    },
    {
      code: `if (window) { console.log(window); }`,
    },
    {
      code: `if (typeof window !== 'undefined' && typeof document !== 'undefined') { document.addEventListener('click', () => {}); }`,
    },
    {
      code: `if (window !== undefined) { window.addEventListener('mousemove', () => {}); }`,
    },
  ],
  invalid: [
    {
      code: `window.addEventListener('resize', () => {});`,
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof window !== "undefined"`) for client-side code.',
        },
      ],
    },
    {
      code: `document.getElementById('app');`,
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof document !== "undefined"`) for client-side code.',
        },
      ],
    },
    {
      code: `document.addEventListener('click', () => {});`,
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof document !== "undefined"`) for client-side code.',
        },
      ],
    },
  ],
});

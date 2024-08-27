const { RuleTester } = require("eslint");
const rule = require("../lib").rules["no-unsafe-client-side-usage"];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

ruleTester.run("no-unsafe-client-side-usage", rule, {
  valid: [
    // Standard globals
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
    // Custom globals
    {
      code: `if (typeof myCustomGlobal !== 'undefined') { myCustomGlobal.doSomething(); }`,
      options: [{ additionalGlobals: ["myCustomGlobal"] }],
    },
    {
      code: `if (myCustomGlobal) { myCustomGlobal.doSomething(); }`,
      options: [{ additionalGlobals: ["myCustomGlobal"] }],
    },
    {
      code: `if ('myCustomGlobal' in globalThis) { myCustomGlobal.doSomething(); }`,
      options: [{ additionalGlobals: ["myCustomGlobal"] }],
    },
    {
      code: `if (myCustomGlobal !== undefined) { myCustomGlobal.doSomething(); }`,
      options: [{ additionalGlobals: ["myCustomGlobal"] }],
    },
  ],
  invalid: [
    // Standard globals
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
    // Custom globals
    {
      code: `myCustomGlobal.doSomething();`,
      options: [{ additionalGlobals: ["myCustomGlobal"] }],
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof myCustomGlobal !== "undefined"`) for client-side code.',
        },
      ],
    },
    {
      code: `anotherCustomGlobal.doSomething();`,
      options: [{ additionalGlobals: ["anotherCustomGlobal"] }],
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof anotherCustomGlobal !== "undefined"`) for client-side code.',
        },
      ],
    },
  ],
});

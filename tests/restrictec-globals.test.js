const { RuleTester } = require("eslint");
const rule = require("../lib/index").rules["no-unsafe-client-side-usage"];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

ruleTester.run("no-unsafe-client-side-usage", rule, {
  valid: [
    {
      code: `window.addEventListener('resize', () => {})`,
      options: [{ restrictedGlobals: ["navigator"] }],
    },
    {
      code: `document.getElementById('app')`,
      options: [{ restrictedGlobals: ["navigator"] }],
    },
    {
      code: `if (typeof navigator !== 'undefined') { navigator.geolocation.getCurrentPosition(() => {}); }`,
      options: [{ restrictedGlobals: ["navigator"] }],
    },
  ],
  invalid: [
    {
      code: `navigator.geolocation.getCurrentPosition(() => {});`,
      options: [{ restrictedGlobals: ["navigator"] }],
      errors: [
        {
          message:
            'Use a safe check (e.g., `typeof navigator !== "undefined"`) for client-side code.',
        },
      ],
    },
  ],
});

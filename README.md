
# eslint-plugin-client-check

An ESLint plugin designed to enforce safe usage of client-side globals like `window`, `document`, and others. This plugin ensures that these globals are properly checked before being used in your code, helping to prevent errors when running JavaScript in environments where these globals may not be available, such as during server-side rendering (SSR) or in non-browser environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Basic Setup](#basic-setup)
  - [Rule Details](#rule-details)
- [Examples](#examples)
  - [Correct Usage](#correct-usage)
  - [Incorrect Usage](#incorrect-usage)
- [Advanced Configuration](#advanced-configuration)
  - [Customizing Restricted and Additional Globals](#customizing-restricted-and-additional-globals)
- [FAQs](#faqs)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

Ensure you have ESLint installed in your project:

```bash
npm install eslint --save-dev
```

Then, install the `eslint-plugin-client-check` plugin:

```bash
npm install eslint-plugin-client-check --save-dev
```

## Usage

To start using the `eslint-plugin-client-check` plugin, add it to your ESLint configuration file (`.eslintrc`, `.eslintrc.json`, or `.eslintrc.js`).

### Basic Setup

Add `client-check` to the `plugins` array and enable the `no-unsafe-client-side-usage` rule:

```json
{
  "plugins": ["client-check"],
  "rules": {
    "client-check/no-unsafe-client-side-usage": "error"
  }
}
```

## Configuration

### Rule Details

The `no-unsafe-client-side-usage` rule enforces that certain global variables, which are only available in the browser environment, are checked for existence before being used in your code. This prevents runtime errors in non-browser environments or during SSR.

### Globals Checked by Default

The rule checks for the following client-side globals by default:

- `window`
- `document`
- `navigator`
- `location`
- `history`
- `localStorage`
- `sessionStorage`
- `fetch`
- `performance`
- `screen`

## Examples

### Correct Usage

Below are examples of code that passes the `no-unsafe-client-side-usage` rule.

#### Example 1: Using `typeof` to Check for `window`

```javascript
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    console.log('Window resized');
  });
}
```

#### Example 2: Using a Truthy Check for `window`

```javascript
if (window) {
  console.log('Window exists');
}
```

#### Example 3: Compound Condition with `typeof`

```javascript
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.addEventListener('click', () => {
    console.log('Document clicked');
  });
}
```

#### Example 4: Checking for `window` in `globalThis`

```javascript
if ('window' in globalThis) {
  console.log('Window exists in globalThis');
}
```

### Incorrect Usage

Below are examples of code that will trigger the `no-unsafe-client-side-usage` rule.

#### Example 1: Using `window` Without a Check

```javascript
window.addEventListener('resize', () => {
  console.log('Window resized');
});
```

#### Example 2: Using `document` Without a Check

```javascript
document.getElementById('app').innerHTML = 'Hello, World!';
```

These examples will result in ESLint errors, prompting you to add the necessary checks.

## Advanced Configuration

### Customizing Restricted and Additional Globals

By default, the plugin checks the most common client-side globals. However, you can customize the list of globals to suit your specific project needs, including adding your own custom globals that you want to enforce checks on.

#### Example: Adding Custom Globals

If you want to add a new global (e.g., `myCustomGlobal`) to the list of restricted globals, you can modify the plugin configuration like this:

```json
{
  "plugins": ["client-check"],
  "rules": {
    "client-check/no-unsafe-client-side-usage": ["error", {
      "additionalGlobals": ["myCustomGlobal"]
    }]
  }
}
```

In this example, `myCustomGlobal` is added to the list of globals that the rule will check. You can also remove or override the default globals by specifying them explicitly under `restrictedGlobals`.

#### Example: Adding and Removing Globals

```json
{
  "plugins": ["client-check"],
  "rules": {
    "client-check/no-unsafe-client-side-usage": ["error", {
      "restrictedGlobals": [
        "window",
        "document",
        // Remove any globals you don't want to check
        // "navigator"
      ],
      "additionalGlobals": [
        "myCustomGlobal"
      ]
    }]
  }
}
```

## FAQs

### Why do I need this plugin?

This plugin is essential for projects that involve server-side rendering (SSR) or environments where certain globals (like `window` or `document`) might not be available. It helps prevent runtime errors by enforcing safe checks before these globals are used.

### Does this plugin support TypeScript?

Yes, this plugin works with TypeScript projects. Just make sure your ESLint setup is configured to parse TypeScript files.

### What if I don't want to enforce all the checks?

You can customize which globals are checked by modifying the `restrictedGlobals` and `additionalGlobals` options as shown in the [Advanced Configuration](#advanced-configuration) section.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the [GitHub repository](https://github.com/yourusername/eslint-plugin-client-check).

If you'd like to contribute code, feel free to submit a pull request. Please ensure that your code adheres to the existing coding standards and includes tests for any new functionality.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

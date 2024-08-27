const defaultRestrictedGlobals = [
  "window",
  "document",
  "navigator",
  "location",
  "history",
  "localStorage",
  "sessionStorage",
  "fetch",
  "performance",
  "screen",
];

const rules = {
  "no-unsafe-client-side-usage": {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Enforce safe usage of client-side globals like window, document, etc.",
        category: "Best Practices",
        recommended: true,
      },
      schema: [
        {
          type: "object",
          properties: {
            restrictedGlobals: {
              type: "array",
              items: {
                type: "string",
              },
              uniqueItems: true,
              default: defaultRestrictedGlobals,
            },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      const options = context.options[0] || {};
      const restrictedGlobals =
        options.restrictedGlobals || defaultRestrictedGlobals;

      return {
        Identifier(node) {
          if (restrictedGlobals.includes(node.name)) {
            let safe = false;

            let current = node.parent;
            while (current) {
              if (
                (current.type === "IfStatement" ||
                  current.type === "ConditionalExpression") &&
                current.test
              ) {
                const conditions = [current.test];

                if (current.test.type === "LogicalExpression") {
                  let logicalNode = current.test;
                  while (logicalNode.type === "LogicalExpression") {
                    conditions.push(logicalNode.left);
                    logicalNode = logicalNode.right;
                  }
                  conditions.push(logicalNode);
                }

                safe = conditions.some((condition) => {
                  return (
                    (condition.type === "BinaryExpression" &&
                      condition.operator === "!==" &&
                      condition.left.type === "UnaryExpression" &&
                      condition.left.operator === "typeof" &&
                      condition.left.argument.name === node.name) ||
                    (condition.type === "BinaryExpression" &&
                      condition.operator === "!==" &&
                      condition.left.type === "Identifier" &&
                      condition.left.name === node.name &&
                      condition.right.type === "Identifier" &&
                      condition.right.name === "undefined") ||
                    (condition.type === "Identifier" &&
                      condition.name === node.name) ||
                    (condition.type === "BinaryExpression" &&
                      condition.operator === "in" &&
                      condition.left.type === "Literal" &&
                      condition.left.value === node.name &&
                      condition.right.type === "Identifier" &&
                      condition.right.name === "globalThis")
                  );
                });

                if (safe) break;
              }
              current = current.parent;
            }

            if (!safe) {
              context.report({
                node,
                message: `Use a safe check (e.g., \`typeof ${node.name} !== "undefined"\`) for client-side code.`,
              });
            }
          }
        },
      };
    },
  },
};

export default {
  rules,
};

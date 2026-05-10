module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "hotfix",
        "chore",
        "docs",
        "refactor",
        "test",
        "perf",
        "build",
        "ci",
        "revert",
      ],
    ],
  },
};

import js from "@eslint/js"
import globals from "globals"
import reactPlugin from "eslint-plugin-react"

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: { react: reactPlugin },
    rules: {
      "no-unused-vars": "warn",
    },
  },
]

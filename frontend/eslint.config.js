const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const reactJSXRuntime = require('eslint-plugin-react/configs/jsx-runtime');
const reactHooks = require('eslint-plugin-react-hooks');
const typescript = require('typescript-eslint').default;

module.exports = [
  js.configs.recommended,
  reactRecommended,
  reactJSXRuntime,
  ...typescript.configs.recommended,
  prettier,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      eqeqeq: ['warn', 'smart'],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
        },
      ],
    }
  }
]
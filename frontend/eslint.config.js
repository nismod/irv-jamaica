import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from 'typescript-eslint';

export default [
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
      '@typescript-eslint/no-explicit-any': 'warn',
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
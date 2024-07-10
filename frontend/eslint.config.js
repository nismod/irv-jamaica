import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import typescript from 'typescript-eslint';

export default [
  js.configs.recommended,
  reactRecommended,
  reactJSXRuntime,
  ...typescript.configs.recommended,
  prettier,
  {
    plugins: {
      // plugins that haven't upgraded to ESLint 9 can be loaded here.
      'import': importPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: "detect"
      },
      'import/resolver': {
        typescript: {
          // https://github.com/import-js/eslint-plugin-import/issues/1872#issuecomment-789895457
          project: '.',
        },
      },
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
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/lib/',
              from: './src/',
              except: ['./lib/'],
              message: 'Code in src/lib  cannot import code from other folders!',
            },
          ],
        },
      ],
    }
  }
]

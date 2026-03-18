import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: [
      'index.html',
      'vite.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
      'dist/**/*',
      'src/volt/**/*'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  {
    rules: {
      'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
      'no-console': ['warn', { allow: ['error', 'info'] }]
    }
  },
  ...ts.configs.recommended,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description'
      }],
      '@typescript-eslint/consistent-type-imports': ['error', {
        fixStyle: 'inline-type-imports'
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowTypedFunctionExpressions: false
      }],
      '@typescript-eslint/explicit-module-boundary-types': ['error', {
        allowArgumentsExplicitlyTypedAsAny: true
      }],
      '@typescript-eslint/typedef': [
        'error',
        {
          arrowParameter: true,
          variableDeclaration: false,
          parameter: true,
          objectDestructuring: false,
          memberVariableDeclaration: true,
          propertyDeclaration: true,
          variableDeclarationIgnoreFunction: true
        }
      ]
    }
  },
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    }
  },
  {
    rules: {
      'vue/attributes-order': ['error', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_DYNAMIC',
          'ATTR_STATIC',
          'ATTR_SHORTHAND_BOOL',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: true
      }],
      'vue/block-order': ['error', {
        order: ['template', 'script', 'style']
      }],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/multi-word-component-names': 'off',
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'never',
          selfClosingTag: {
            singleline: 'never',
            multiline: 'never'
          }
        }
      ],
      'vue/max-len': ['error', {
        code: 150,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreHTMLTextContents: true,
        ignoreHTMLAttributeValues: true
      }],
      'vue/v-bind-style': ['error', 'shorthand', {
        sameNameShorthand: 'never'
      }],
      'vue/v-on-handler-style': [
        'error',
        'inline',
        { ignoreIncludesComment: false }
      ]
    }
  },
  stylistic.configs.customize({
    flat: true,
    indent: 2,
    commaDangle: 'never',
    jsx: true,
    quotes: 'single',
    semi: false
  }),
  {
    rules: {
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-spacing': 'error',
      '@stylistic/arrow-parens': 'error',
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-style': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/function-call-argument-newline': ['error', 'never'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/lines-between-class-members': ['error', 'always'],
      '@stylistic/no-extra-parens': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-mixed-operators': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', {
        max: 2,
        maxEOF: 0
      }],
      '@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
      '@stylistic/object-curly-newline': 'off',
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true
      }],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/switch-colon-spacing': 'error',
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/wrap-regex': 'error'
    }
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
]

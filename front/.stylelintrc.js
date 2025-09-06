module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    // Allow Tailwind's @apply directive and other at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'container',
          'supports',
          'media',
          'keyframes',
        ],
      },
    ],
    // Allow standard CSS functions and Tailwind's theme()
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'calc', 'var', 'color-mix', 'rgb', 'rgba', 'hsl', 'hsla'],
      },
    ],
    // Allow Tailwind's utility classes with numbers, dots, and slashes
    'selector-class-pattern': [
      '^([a-z0-9_./:-]+|\\([0-9a-z_ -]*\\)|!?[a-z0-9_./:-]+|\[.*\])*$',
      {
        resolveNestedSelectors: true,
        message: 'Expected class selector to match Tailwind pattern',
      },
    ],
    // Allow custom property names with double dashes
    'custom-property-pattern': [
      '^[a-z][a-zA-Z0-9-]*$',
      {
        message: 'Expected custom property name to be kebab-case',
      },
    ],
    // Disable rules that conflict with Tailwind
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'property-no-vendor-prefix': null,
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['/^--font-/', '--font-sans', '--font-mono'],
      },
    ],
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-single-line-max-declarations': 1,
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'max-empty-lines': 1,
    'no-extra-semicolons': true,
    'no-missing-end-of-source-newline': true,
  },
};

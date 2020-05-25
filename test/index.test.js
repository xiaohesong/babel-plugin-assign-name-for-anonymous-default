/* eslint-env mocha */
/* eslint-disable no-undef */
import { assert } from 'chai'
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx'
import babelPluginDecoratorSyntax from '@babel/plugin-proposal-decorators'
import babelPluginTransformClassProperties from '@babel/plugin-proposal-class-properties'
import path from 'path'
import fs from 'fs'
import { transformFileSync } from '@babel/core'
import babelAssignNameForAnonymous from '../src/index'

const JSXS = [
  'basic-react',
  'memo-react',
  'stateless-react',
  'inject',
  'mobx-inject',
]
const INJECTS = ['inject', 'inject-second', 'mobx-inject']
const PREFIXS = ['prefixname', 'prefix-lift-name']
const NOT_STRICTS = ['mobx-inject']
const UN_HANDLES = ['inject', 'inject-second', 'memo-react']

function trim(str) {
  return str.replace(/^\s+|\s+$/, '')
}

describe('assign name for export default anonymous', () => {
  const fixturesDir = path.join(__dirname, './fixtures')
  fs.readdirSync(fixturesDir).forEach((caseName) => {
    describe(`${caseName} type`, () => {
      let expected
      const fixtureDir = path.join(fixturesDir, caseName)
      try {
        // eslint-disable-next-line prettier/prettier
        const expectedFileName = caseName === 'for-index' ? 'expected.js' : 'index.js'
        expected = fs
          .readFileSync(path.join(fixtureDir, expectedFileName))
          .toString()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('read test file error', e)
      }

      const babelConfig = {
        babelrc: false,
        plugins: [
          JSXS.includes(caseName) ? babelPluginSyntaxJsx : '',
          INJECTS.includes(caseName)
            ? [babelPluginDecoratorSyntax, { legacy: true }]
            : '',
          babelPluginTransformClassProperties,
          [
            babelAssignNameForAnonymous,
            {
              prefixName: PREFIXS.includes(caseName) ? 'prefix' : '',
            },
          ],
        ].filter(Boolean),
      }

      it(caseName, () => {
        // eslint-disable-next-line prettier/prettier
        const writedFilename = caseName === 'for-index' ? 'index.js' : 'writed.js'
        const writed = transformFileSync(
          path.join(fixtureDir, writedFilename),
          babelConfig
        ).code
        if (NOT_STRICTS.includes(caseName) || UN_HANDLES.includes(caseName)) {
          assert.notStrictEqual(trim(writed), trim(expected))
          return
        }
        assert.strictEqual(trim(writed), trim(expected))
      })
    })
  })
})

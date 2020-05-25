/* eslint-disable import/no-dynamic-require */
/**
 * FunctionDeclaration: export default function() {}
 * ArrowFunctionExpression: export default () => {}
 * ClassDeclaration: export default class {}
 * CallExpression: export default (function(){return function(){}})()
 */

const exportName = ({ name, path }) => {
  let index = 0
  let usedName = name
  while (path.scope.hasBinding(usedName)) {
    index += 1
    usedName = name + index
  }
  return usedName
}

const regxName = (name) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  name
    .replace(/(\.(js|jsx|ts|tsx)$)|(-|_|\.$)/g, '')
    .replace(/^\S/, (s) => s.toUpperCase())

const getFileName = (originFileName) => {
  const pathNames = originFileName.split('/')
  // name with multiple .
  let name = regxName(pathNames.pop())
  while (/Index/.test(name)) {
    name = `${regxName(pathNames.pop())}`
  }
  return name
}

// https://babeljs.io/docs/en/babel-types
// https://astexplorer.net/
export default function (babel) {
  const { types, traverse } = babel
  return {
    visitor: {
      Program(programPath, state) {
        if (state.opts.plugins) {
          const pluginsState = state
          const pluginsVisitors = state.opts.plugins.map((pluginOpts) => {
            // eslint-disable-next-line prettier/prettier
            const pluginName = typeof pluginOpts === 'string' ? pluginOpts : pluginOpts[0]

            if (typeof pluginOpts !== 'string') {
              pluginsState.opts = {
                ...pluginsState.opts,
                ...pluginOpts[1],
              }
            }

            // eslint-disable-next-line global-require
            let plugin = require(pluginName)
            if (typeof plugin !== 'function') {
              plugin = plugin.default
            }

            return plugin(babel).visitor
          })

          traverse(
            programPath.parent,
            traverse.visitors.merge(pluginsVisitors),
            programPath.scope,
            pluginsState,
            programPath.parentPath
          )
        }
        const { filename } = state.file.opts
        let { prefixName = '' } = state.opts
        prefixName = prefixName.replace(/^\S/, (s) => s.toUpperCase())
        let name = `${prefixName}${getFileName(filename)}`
        programPath.traverse({
          ExportDefaultDeclaration(path) {
            name = exportName({ name, path })
            const { declaration } = path.node
            const replaceMutil = ({ newed, currentPath }) => {
              const [replacedPath] = path.replaceWithMultiple([
                types.variableDeclaration('const', [
                  types.variableDeclarator(types.identifier(name), newed),
                ]),
                types.exportDefaultDeclaration(types.identifier(name)),
              ])

              path.scope.registerDeclaration(replacedPath)
              currentPath.skip()
            }
            if (declaration.id && declaration.id.name) {
              return
            }
            path.traverse({
              ArrowFunctionExpression(currentPath) {
                const newed = types.arrowFunctionExpression(
                  declaration.params,
                  declaration.body,
                  declaration.async
                )
                newed.generator = declaration.generator
                replaceMutil({ newed, currentPath })
              },
              ClassDeclaration(currentPath) {
                const newed = types.classExpression(
                  undefined,
                  declaration.superClass,
                  declaration.body,
                  declaration.decorators || []
                )
                replaceMutil({ newed, currentPath })
              },
              FunctionDeclaration(currentPath) {
                const newed = types.functionExpression(
                  undefined,
                  declaration.params,
                  declaration.body,
                  declaration.generator,
                  declaration.async
                )
                replaceMutil({ newed, currentPath })
              },
              CallExpression(currentPath) {
                // const newed = types.CallExpression(
                //   declaration.callee,
                //   declaration.arguments || []
                // )
                // replaceMutil({ newed, currentPath })
                currentPath.skip()
              },
              StringLiteral(currentPath) {
                const newed = types.stringLiteral(declaration.value)
                replaceMutil({ newed, currentPath })
              },
              NumericLiteral(currentPath) {
                const newed = types.numericLiteral(declaration.value)
                replaceMutil({ newed, currentPath })
              },
              NullLiteral(currentPath) {
                const newed = types.nullLiteral()
                replaceMutil({ newed, currentPath })
              },
              BooleanLiteral(currentPath) {
                const newed = types.booleanLiteral(declaration.value)
                replaceMutil({ newed, currentPath })
              },
              Identifier(currentPath) {
                if (declaration.name === 'undefined') {
                  const newed = types.identifier('undefined')
                  replaceMutil({ newed, currentPath })
                }
                currentPath.skip()
              },
              ObjectExpression(currentPath) {
                const newed = types.objectExpression(
                  declaration.properties || []
                )
                replaceMutil({ newed, currentPath })
              },
              ArrayExpression(currentPath) {
                const newed = types.arrayExpression(declaration.elements || [])
                replaceMutil({ newed, currentPath })
              },
            })
          },
        })
      },
    },
  }
}

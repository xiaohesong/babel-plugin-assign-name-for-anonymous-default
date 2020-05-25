<h1 align="center">Welcome to babel-plugin-assign-name-for-anonymous-default 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/babel-plugin-assign-name-for-anonymous-default" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/babel-plugin-assign-name-for-anonymous-default.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> assign name for anonymous default

## Install

```sh
yarn install babel-plugin-assign-name-for-anonymous-default
```

## Usage

- .babelrc
```json
{
  "plugins": [
    // with options
    [
      "babel-plugin-assign-name-for-anonymous-default",
      {
        "prefixName": 'prexname'
      }
    ],
    // without options
    "babel-plugin-assign-name-for-anonymous-default"
  ]
}
```
Or in webpck:
```js
{
  loader: 'babel-loader',
  options: {
    plugins: ['babel-plugin-assign-name-for-anonymous-default']
  }
}
```

## Author

👤 **xiaohesong <didmehh163@gmail.com>**

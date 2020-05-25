import React from 'react'

const observer = Class => Class

const inject = name => observerClass => console.log(observerClass, 'observerClass inject name', name)

@observer
class W extends React {
  render() {
    return <p>依赖注入的情况</p>
  }
}

export default inject('injectName')(W) 
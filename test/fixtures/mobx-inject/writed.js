import React from 'react'
import { inject, observer as myObser, Provider } from 'mobx-react'
import { observable } from 'mobx'

class Store {
  @observable id
}

const injectStore = new Store

class App extends React.Component {
  render() {
    return (
      <Provider injectStore={injectStore}>
        <div>
          <Sub />
        </div>
      </Provider>
    )
  }
}

// @ovserver
class Sub extends React.Component {
  render() {
    console.log('this props is', this.props.injectStore.id)
    return (
      <p>Hi</p>
    )
  }
}

export default inject('injectStore')(myObser(Sub))

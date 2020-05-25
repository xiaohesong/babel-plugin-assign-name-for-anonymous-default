var _class;

import React from 'react';

const observer = Class => Class;

const inject = name => observerClass => console.log(observerClass, 'observerClass inject name', name);

let W = observer(_class = class W extends React {
  render() {
    return <p>依赖注入的情况</p>;
  }

}) || _class;

const Writed = inject('injectName')(W);
export default Writed;
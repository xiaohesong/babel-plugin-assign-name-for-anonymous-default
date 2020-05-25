var _class;

const inject = (...args) => func => {
  console.log('注入的名称是', args);
  return func;
};

const observer = func => func;

let Layout = observer(_class = class Layout {}) || _class;

const Writed = inject('customerBasic', 'customerApproval')(Layout);
export default Writed;
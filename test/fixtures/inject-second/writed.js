const inject = (...args) => func => {
	console.log('注入的名称是', args)
    return func
}

const observer = (func) => func

@observer
class Layout {

}

export default inject('customerBasic', 'customerApproval')(Layout)
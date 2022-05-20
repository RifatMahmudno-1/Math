const { validate, removeZero } = require('./common.js')
const { addition } = require('./addSub.js')
function multiplyCore(nums) {
	nums = nums.sort((a, b) => b.length - a.length)
	let result = new Array()
	for (let i = nums[1].length - 1; i >= 0; i--) {
		let carry = new Number()
		let res = new String()
		let n2 = Number(nums[1][i])
		for (let a = 0; a < nums[1].length - i - 1; a++) {
			res = '0' + res
		}
		for (let j = nums[0].length - 1; j >= 0; j--) {
			let n1 = Number(nums[0][j])
			let calc = n1 * n2 + carry
			carry = 0
			if (calc > 9) {
				calc = calc.toString()
				carry = Number(calc[0])
				res = calc[1] + res
			} else res = calc + res
			if (j == 0 && carry > 0) res = carry + res
		}
		result.push(res)
	}
	return addition(result)
}
function multiplyMain(nums) {
	nums[1] = multiplyCore([nums[0], nums[1]])
	nums = nums.slice(1)
	return nums.length == 1 ? nums[0] : multiplyMain(nums)
}
function multiply(...nums) {
	if (nums.length === 0) return { error: 'No number was provided' }
	nums = validate(nums)
	if (nums.error) return nums
	let isNeg = false
	let deciPos = new Number()
	nums = nums.map(e => {
		if (e.startsWith('-')) {
			e = e.slice(1)
			isNeg = !isNeg
		}
		let split = e.split('.')
		if (split.length > 1) {
			deciPos += split[1].length
			e = split.join('')
		}
		return e
	})
	let result = multiplyMain(nums)
	let times = deciPos - result.length
	for (let i = 0; i < times; i++) {
		result = '0' + result
	}
	if (deciPos > 0) result = result.slice(0, result.length - deciPos) + '.' + result.slice(result.length - deciPos)
	if (isNeg) result = '-' + result
	return removeZero(result)
}
module.exports = { multiply }

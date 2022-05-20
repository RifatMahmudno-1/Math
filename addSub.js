const { validate, removeZero, isBigger } = require('./common.js')

function additionCore(nums, MaxL, carry, type) {
	let result = new String()
	for (var a = MaxL - 1; a >= 0; a--) {
		let sum = new Number()
		for (let b = 0; b < nums.length; b++) {
			sum = sum + (Number(type == 'int' ? nums[b][a + nums[b].length - MaxL] : nums[b][a]) || 0)
		}
		sum = sum + carry
		carry = 0
		if (sum <= 9) result = sum + result
		else {
			sum = sum.toString()
			result = sum.slice(-1) + result
			carry = Number(sum.slice(0, sum.length - 1))
		}
	}
	if (carry && type == 'int') result = carry + result
	return [result, carry]
}
function addition(nums) {
	let ints = new Array()
	let intMaxL = new Number()
	let intRes = new String()
	let decis = new Array()
	let deciMaxL = new Number()
	let deciRes = new String()
	let carry = new Number()
	nums.forEach(el => {
		el = el.split('.')
		if (el[0] && el[0] != '0') {
			ints.push(el[0])
			if (intMaxL < el[0].length) intMaxL = el[0].length
		}
		if (el[1] && el[1] != '0') {
			decis.push(el[1])
			if (deciMaxL < el[1].length) deciMaxL = el[1].length
		}
	})
	;[deciRes, carry] = additionCore(decis, deciMaxL, 0)
	;[intRes, carry] = additionCore(ints, intMaxL, carry, 'int')
	return removeZero([intRes, deciRes].join('.'))
}
function subtractionCore(nums, maxL, carry, type) {
	let result = new String()
	for (let i = maxL - 1; i >= 0; i--) {
		let n1 = type == 'int' ? Number(nums[0][i + nums[0].length - maxL]) || 0 : Number(nums[0][i]) || 0
		let n2 = type == 'int' ? (Number(nums[1][i + nums[1].length - maxL]) || 0) + carry : (Number(nums[1][i]) || 0) + carry
		carry = 0
		if (n2 > n1) {
			n1 = n1 + 10
			carry = 1
		}
		let sum = n1 - n2
		result = sum + result
	}
	return [result, carry]
}
function subtraction(pos, neg) {
	if (pos === neg) return '0'
	let isNeg = !isBigger(pos, neg)
	let ints = new Array()
	let intMaxL = new Number()
	let intRes = new String()
	let decis = new Array()
	let deciMaxL = new Number()
	let deciRes = new String()
	let carry = new Number()
	;(isNeg ? [neg, pos] : [pos, neg]).forEach(el => {
		el = el.split('.')
		if (el[0]) {
			ints.push(el[0])
			if (intMaxL < el[0].length) intMaxL = el[0].length
		} else ints.push('0')
		if (el[1]) {
			decis.push(el[1])
			if (deciMaxL < el[1].length) deciMaxL = el[1].length
		} else decis.push('0')
	})
	;[deciRes, carry] = subtractionCore(decis, deciMaxL, carry)
	;[intRes, carry] = subtractionCore(ints, intMaxL, carry, 'int')
	return (isNeg ? '-' : '') + removeZero([intRes, deciRes].join('.'))
}

function addSub(...nums) {
	if (nums.length === 0) return { error: 'No number was provided' }
	nums = validate(nums)
	if (nums.error) return nums
	let add = new Array()
	let sub = new Array()
	nums.forEach(el => (el.startsWith('-') ? sub.push(el.slice(1)) : add.push(el)))
	if (add.length > 0) {
		if (nums.length == add.length && add.length == 1) return add[0]
		if (nums.length == add.length) return addition(add)
	}
	if (sub.length > 0) {
		if (nums.length == sub.length && sub.length == 1) return '-' + sub[0]
		if (nums.length == sub.length) return '-' + addition(sub)
	}
	return subtraction(add.length == 1 ? add[0] : addition(add), sub.length == 1 ? sub[0] : addition(sub))
}

module.exports = { addSub, addition, subtraction }

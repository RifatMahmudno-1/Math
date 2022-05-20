const { multiply } = require('./multiply.js')
const { subtraction } = require('./addSub.js')
const { removeZero, isBigger, validate } = require('./common.js')

function divisionCore(num1, num2, run) {
	let result = new String()
	let doneCalc = false
	let curr = new String()
	if (num1.length > num2.length) {
		curr = num1.slice(0, num2.length)
		num1 = num1.slice(num2.length)
	} else {
		curr = num1
		num1 = ''
	}
	while (!doneCalc) {
		run--
		let addedFreeNum = false
		let addedFreeZero = false
		let wasN1 = num1 !== '' ? true : false
		while (isBigger(num2, curr)) {
			if (num1 !== '') {
				if (!addedFreeNum) {
					curr += num1[0]
					num1 = num1.slice(1)
					addedFreeNum = true
				} else {
					curr += num1[0]
					num1 = num1.slice(1)
					result += '0'
				}
			} else {
				if (wasN1 && num1 == '') result += '0'
				if (!result.includes('.')) result += '.'
				if (!addedFreeZero) {
					curr += '0'
					addedFreeZero = true
				} else {
					curr += '0'
					result += '0'
				}
			}
		}
		for (let i = 1; i <= 10; i++) {
			let res = multiply(num2, i.toString())
			if (res === curr) {
				result += i
				curr = ''
				break
			}
			if (isBigger(res, curr)) {
				result += i - 1
				curr = subtraction(curr, multiply(num2, (i - 1).toString()))
				break
			}
		}
		while (num1.startsWith('0')) {
			num1 = num1.slice(1)
			result += '0'
		}
		if ((curr === '' && num1 === '') || !run) doneCalc = true
	}
	return result
}
function divideMain(nums, length, isNeg) {
	if (nums[0] != '0' && nums[1] == '0') return 'undefined'
	if (nums[0] == '0' && nums[1] != '0') {
		if (nums.length == 2) return '0'
		nums = nums.slice(1)
		nums[0] = '0'
		return divideMain(nums, length, isNeg)
	}
	if (nums[0] == '0' && nums[1] == '0') return 'undefined'
	let deciPos = new Number()
	if (nums[1].includes('.')) {
		deciPos += nums[1].split('.')[1].length
		nums[1] = nums[1].replace('.', '')
	}
	if (nums[0].includes('.')) {
		let newNum = nums[0].split('.')[1]
		if (newNum && newNum !== '0') {
			deciPos -= newNum.length
			nums[0] = nums[0].replace('.', '')
		}
	}
	let result = divisionCore(removeZero(nums[0]), removeZero(nums[1]), length)
	//end if no decimal
	if (deciPos == 0) {
		if (nums.length == 2) return isNeg ? '-' + removeZero(result) : removeZero(result)
		nums = nums.slice(1)
		nums[0] = removeZero(result)
		return divideMain(nums, length, isNeg)
	}
	result = result.includes('.') ? result : result + '.'
	if (deciPos > 0) {
		let movePos = result.indexOf('.') + deciPos
		let oldRes = result.split('.')
		if (movePos > oldRes[1].length) {
			let times = movePos - oldRes[1].length
			for (let i = 0; i < times; i++) {
				result += '0'
			}
		}
		result = result.replace('.', '')
		result = result.slice(0, movePos) + '.' + result.slice(movePos, result.length)
	}
	if (deciPos < 0) {
		let movePos = Math.abs(deciPos)
		let oldRes = result.split('.')
		if (movePos > oldRes[0].length) {
			let times = movePos - oldRes[0].length
			for (let i = 0; i < times; i++) {
				result = '0' + result
			}
		}
		oldRes = result.split('.')
		result = result.replace('.', '')
		result = result.slice(0, oldRes[0].length - movePos) + '.' + result.slice(oldRes[0].length - movePos, result.length)
	}
	//end
	if (nums.length == 2) return isNeg ? '-' + removeZero(result) : removeZero(result)
	nums = nums.slice(1)
	nums[0] = removeZero(result)
	return divideMain(nums, length, isNeg)
}
function divide(...nums) {
	let isNeg = false
	let lengthInd = nums.findIndex(el => typeof el == 'object' && el.length)
	let length = 10
	if (lengthInd > -1) {
		length = nums[lengthInd].length
		nums.splice(lengthInd, 1)
	}
	nums = validate(nums)
	if (nums.error) return nums
	if (nums.length === 0) return { error: 'No number was provided' }
	if (nums.length == 1) return nums[0]
	nums = nums.map(e => {
		if (e.startsWith('-')) {
			e = e.slice(1)
			isNeg = !isNeg
		}
		return e
	})
	return divideMain(nums, length, isNeg)
}
module.exports = { divide }

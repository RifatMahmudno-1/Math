function removeZero(num) {
	let isNeg = num.includes('-')
	if (isNeg) num = num.slice(1)
	while (num.startsWith('0') || (num.includes('.') && num.endsWith('0'))) {
		if (num.startsWith('0')) num = num.slice(1)
		if (num.includes('.') && num.endsWith('0')) num = num.slice(0, num.length - 1)
	}
	num = num.split('.')
	if (!num[0]) num[0] = '0'
	return (isNeg ? '-' : '') + (num[1] ? num.join('.') : num[0])
}
function validate(nums) {
	for (let i = 0; i < nums.length; i++) {
		if (typeof nums[i] == 'number' || nums[i] == '') return { error: 'Input must be string of numbers.' }
		if (nums[i].replace(/-?([0-9]+)?[.]?([0-9]+)?/, '') || nums[i] == '.') return { error: 'Invalid number provided' }
		nums[i] = removeZero(nums[i])
	}
	return nums
}
function isBigger(num1, num2) {
	if (num1 === num2) return false
	num1 = num1.split('.')
	num2 = num2.split('.')
	if (num1[0].length > num2[0].length) return true
	if (num1[0].length < num2[0].length) return false
	for (var i = 0; i < num1[0].length; i++) {
		if (Number(num1[0][i]) > Number(num2[0][i])) return true
		if (Number(num1[0][i]) < Number(num2[0][i])) return false
	}
	if (num1[1] && !num2[1]) return true
	if (!num1[1] && num2[1]) return false
	for (let i = 0; i < Math.max(num1[1].length, num2[1].length); i++) {
		if (num1[1][i] && !num2[1][i]) return true
		if (!num1[1][i] && num2[1][i]) return false
		if (Number(num1[1][i]) > Number(num2[1][i])) return true
		if (Number(num1[1][i]) < Number(num2[1][i])) return false
	}
}

module.exports = { removeZero, validate, isBigger }

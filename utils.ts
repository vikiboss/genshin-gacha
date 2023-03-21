/**
 * 生成随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number} 随机范围内的整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 取数组内随机一项
 * @param {Array<T>} array 待操作数组
 * @return {T} 数组内的随机一项
 */
export function randomItem<T = any>(array: [T, ...T[]]): T {
  return array[randomInt(0, array.length - 1)]
}

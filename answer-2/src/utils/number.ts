/**
 * 生成随机数，~~ 比 floor 性能更佳（不要传负数）
 * @param max 最大值（取不到，只可取正整数）
 * @param min 最小值
 */
export const randomNum = (max: number, min: number = 0) => {
  return ~~(Math.random() * (max - min) + min);
}


// 任意类型对象
export type AnyObj = {
  [prop: string | number | symbol]: any
}

/**
 * 校验数据为何类型
 * @param o 
 * @returns 
 */
export function isType(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}
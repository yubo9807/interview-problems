
/**
 * 深度克隆对象
 * JSON.parse(JSON.stringify(obj))  // 此方法无法合并代理对象
 * @param obj 
 */
export function cloneObj(obj: any) {
  // 克隆算法
  if (obj instanceof Array) return cloneArray(obj);
  else if (obj instanceof Object) return cloneObject(obj);
  else return obj;
}
function cloneObject (obj: any) {
  let result = {};
  let names = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < names.length; i ++) {
      result[names[i]] = cloneObj(obj[names[i]]);
  }
  return result;
}
function cloneArray (obj: any[]) {
  let result = new Array(obj.length);
  for (let i = 0; i < result.length; i ++) {
      result[i] = cloneObj(obj[i]);
  }
  return result;
}

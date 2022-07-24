import { Context } from 'koa';

/**
 * 将 code 码统一，方便前端拦截器处理
 * @param ctx
 * @param code code 码
 * @param msg 错误消息
 * @param print 是否需要打印日志
 */
export function throwError(ctx: Context, code: number = 400, msg: string = 'unknown error', print = true) {

  const { state } = ctx;
  state.msg = msg;
  state.code = code;

  if (print) {
    const error = new Error(state.msg);
    // 记录日志
    // console.log(error);
  }

  ctx.throw(200, JSON.stringify(state));

}

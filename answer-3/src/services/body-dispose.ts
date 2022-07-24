import { Context } from 'koa';
import { throwError } from './error-deal-with';

export default async(ctx: Context, next: () => {}) => {


	ctx.state.code = 400;
	ctx.state.msg = '';

	
	// 捕获错误，打印日志
	try {
		await next();
	} catch (error) {
		// code 依然为 400，说明错误并没有被捕获到
		if (ctx.state.code === 400 && error) {
			throwError(ctx, 400, error.message);
		}
	}

	// 等待所有中间件完成后执行，规范数据格式
	const { state, body } = ctx;

	if (!state.msg && !body) {  // 没消息，也没body
		throwError(ctx, 404, '无效请求');
	}

	if (body) {  // 正常返回数据
		ctx.body = {
			ok: true,
			status: 200,
			data: body,
		}
	} else {  // 其他异常情况，自行设置 code msg 进行处理
		ctx.body = {
			status: state.code,
			msg: state.msg,
		};
	}

}

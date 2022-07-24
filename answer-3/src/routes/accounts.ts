import Router from '@koa/router';
import check from './check';

const router = new Router();

interface SignupBody {
  username: string
  password: string
}

router.post('/signup', async (ctx, next) => {

  const body: SignupBody = ctx.request.body;
  check(body)(ctx);


  ctx.cookies.set('token', 'encryption token', { httpOnly: true });
  ctx.body = '注册成功';
  next();
})

export = router;
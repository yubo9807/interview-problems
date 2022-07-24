import koa from 'koa';
import http from 'http';
import bodyParser from 'koa-bodyparser';
import bodyDispose from './services/body-dispose';
import router from './routes';

const app = new koa();
const server = http.createServer(app.callback());

app.use(bodyParser());
app.use(bodyDispose);
app.use(router.routes());

const prot = 9528;
server.listen(prot, () => {
  console.log(`http://localhost:${prot}`);
})

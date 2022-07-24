import Router from '@koa/router';
const routes = new Router();

const routerList = [
	{ url: '/accounts', route: require('./accounts') },
]

routerList.forEach(val => {
	routes.use(val.url, val.route.routes());
})

export default routes;
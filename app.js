const koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const co = require('co');
const render = require('koa-swig');
const sql = require('mssql');
const dotenv = require('dotenv').load();

const app = new koa();
const router = Router();

app.use(logger());
app.use(bodyParser());
app.use(serve(__dirname+'/views'));
app.use(router.routes());

app.context.render = co.wrap(render({
  root: __dirname + '/views',
  autoescape: true,
  cache: 'memory',
  ext: 'html',
}));

var config = {
  user:process.env.user,
  password:process.env.password,
  server:process.env.server,
  port:process.env.port,
  database: process.env.database
}

app.use(logger());
app.use(serve('./views'));

router.get('/',home);
async function home(ctx){
  try{
    var pool = await sql.connect(config);
    var result = await pool.request()
                      .query("create table apple6(mid char(10))");
    console.dir(result);
    sql.close();
  }catch(err){
    console.log(err);
    sql.close();
  }
  ctx.body = await ctx.render('home',{data:'Hello World Apple'});
}

app.listen(3000);
console.log('listening on port 3000');

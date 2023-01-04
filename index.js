const koa = require('koa')
const validate = require('./jiba')
const { koaBody } = require('koa-body');

const deta = false
try {
    const { Deta } = require('deta');
    deta = true
} catch (error) { }

const app = new koa()

app.use(koaBody())

/**
 * 
 * @param {koa.ParameterizedContext} ctx 
 * @param {koa.Next} next 
 */
const logger = (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url} message: ${ctx.request.body.message}`)
    next()
}

app.use(logger);

/**
 * 
 * @param {koa.ParameterizedContext} ctx 
 * @param {koa.Next} next 
 */
const main = (ctx, next) => {
    if (!ctx.request.body || !ctx.request.body.message) {
        ctx.request.status = 500
        ctx.body = 'Use POST and request body should have \'message\' paremeter'
    } else {
        ctx.body = validate(ctx.request.body.message)
    }
    next()
}

app.use(main)


module.exports = app
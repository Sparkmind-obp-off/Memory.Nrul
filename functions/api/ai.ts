import app from '../../src/index'
export const onRequest: PagesFunction = context => app.fetch(context.request, context.env)

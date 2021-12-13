import Vue from 'vue'
// import VueAnalytics from 'vue-analytics'
import VueGtag from "vue-gtag";

export default async (ctx, inject) => {
  console.log('in plugin')
  const runtimeConfig = ctx.$config && ctx.$config.googleAnalytics || {}
  const moduleOptions = <%= serialize(options) %>
  const options = {...moduleOptions, ...runtimeConfig}

  if (typeof options.asyncID === 'function') {
    options.id = await options.asyncID(ctx)
  }
  console.log('setting up vuegtag')
  // Vue.use(VueAnalytics, {...{ router: ctx.app.router }, ...options})
  Vue.use(VueGtag, {
  config: {
    ...options
  }}, ctx.app.router)

  console.log('success')
  // ctx.$ga = Vue.$ga
  // inject('ga', Vue.$ga)
}

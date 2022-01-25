/*!
 * VueSandbox v1.0.0-beta.2
 * (c) 2021-2021 Mekkanix
 * Released under the MIT License.
 */

import Vue from 'vue'
import router from '@ui/plugins/router.js'
import store from '@ui/plugins/vuex.js'
import '@ui/plugins/bootstrap-vue.js'
import VSApp from '@ui/components/VSApp.vue'

const init = () => {
  // Initialize VS app
  new Vue({
    el: '#vs-app',
    render: h => h(VSApp),
    router,
    store,
  })
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})

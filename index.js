'use strict'

import VuetifyDateRangePicker from './components/DateRangePicker'

export default {
  install(Vue, options) {
    Vue.component(VuetifyDateRangePicker.name, VuetifyDateRangePicker)
  }
}

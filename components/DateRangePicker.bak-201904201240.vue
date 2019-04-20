<template>
	<v-menu
		:close-on-content-click="false"
		:nudge-right="40"
		:return-value.sync="dates"
		full-width
		lazy
		min-width="290px"
		offset-y
		transition="scale-transition"
		v-model="menu"
	>
		<v-combobox @click:clear="clear" slot="activator" v-bind="$attrs" v-model="value_data"></v-combobox>
		<v-card class="date-range-picker" v-if="menu">
			<v-card-title class="subheading primary white--text">
				<template v-if="dates&&dates.length===2">
					<span class="pr-2 font-weight-bold">From</span>
					{{sortDate(dates)[0]}}
					<span class="px-2 font-weight-bold">To</span>
					{{sortDate(dates)[1]}}
				</template>
				<template v-else-if="dates&&dates.length===1">{{dates[0]}}</template>
				<template v-else>Empty</template>
			</v-card-title>
			<v-layout row wrap>
				<v-flex class="white" xs3>
					<v-layout column>
						<v-btn
							:color="isActive(item.number,item.unit)?'green':'grey darken-3'"
							:key="item.name"
							@click="setDateByUnit(item.number,item.unit)"
							flat
							v-for="item in sorts"
						>
							<span class="caption font-weight-medium">{{item.name}}</span>
						</v-btn>
					</v-layout>
				</v-flex>
				<v-flex d-flex xs9>
					<v-date-picker
						:events="selectedArray"
						:first-day-of-week="1"
						@input="val => chooseDay(val)"
						color="primary"
						event-color="primary"
						multiple
						no-title
						reactive
						v-if="menu"
						v-model="dates"
					>
						<v-spacer></v-spacer>
						<v-btn @click="cancel()" flat>Cancel</v-btn>
						<v-btn @click="emmit()" color="primary" flat>OK</v-btn>
					</v-date-picker>
				</v-flex>
			</v-layout>
		</v-card>
	</v-menu>
</template>

<script>
export default {
  name: 'VDateRangePicker',
  inheritAttrs: false,
  props: {
    value: null,
    clearReturn: {
      type: Boolean,
      required: false,
      default: false
    },
    hideTitle: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      value_data: null,
      dates: [],
      selectedArray: [],
      menu: false,
      sorts: [
        {
          name: 'Today',
          number: undefined,
          unit: undefined
        },
        {
          name: 'Yesterday',
          number: -1,
          unit: undefined
        },
        {
          name: 'This week',
          number: 0,
          unit: 'week'
        },
        {
          name: 'Last week',
          number: -1,
          unit: 'week'
        },
        {
          name: 'This month',
          number: 0,
          unit: 'month'
        },
        {
          name: 'Last month',
          number: -1,
          unit: 'month'
        },
        {
          name: 'This year',
          number: 0,
          unit: 'year'
        }
      ]
    }
  },
  watch: {
    menu(val) {
      if (val) {
        this.updateValueData(this.value)
      } else {
        //reset data
        if (!this.value) {
          this.dates.length = 0
        }
        this.selectedArray.length = 0
        this.$forceUpdate()
      }
    },
    value: {
      handler(val) {
        this.updateValueData(val)
      },
      deep: true
    },
    value_data: {
      handler(val) {
        // update dates
        if (val) {
          if (val.length === 1 && val[0]) {
            this.$set(this, 'dates', [val[0]])
          } else if (val.length === 2 && val[0] && val[1]) {
            this.$set(this, 'dates', [val[0], val[1]])
            this.selectedArray = this.getDaysArray(this.dates[0], this.dates[1])
          } else {
            this.$set(this, 'dates', [])
          }
        } else {
          this.$set(this, 'dates', [])
        }
      },
      deep: true
    }
  },
  methods: {
    updateValueData(val) {
      if (val && Object.keys(val).length > 0) {
        if (val.from && val.to) {
          if (val.from === val.to) {
            this.$set(this, 'value_data', [val.from])
          } else {
            this.$set(this, 'value_data', [val.from, val.to])
          }
        }
      } else {
        // Null
        this.$set(this, 'value_data', [])
      }
    },
    sortDate(dates) {
      if (this.$moment(dates[0], 'YYYY-MM-DD').isAfter(dates[1])) {
        return [dates[1], dates[0]]
      }
      return dates
    },
    chooseDay() {
      if (this.dates.length > 2) {
        this.dates.shift()
        this.selectedArray = this.getDaysArray(this.dates[0], this.dates[1])
      } else if (this.dates.length === 1) {
        this.selectedArray.length = 0
      } else if (this.dates.length === 2) {
        this.selectedArray = this.getDaysArray(this.dates[0], this.dates[1])
      }
    },
    getDaysArray(startDate, stopDate) {
      var dateArray = []
      var currentDate = this.$moment(startDate)
      var stopDate = this.$moment(stopDate)

      if (currentDate > stopDate) {
        let tempday = currentDate
        currentDate = stopDate
        stopDate = tempday
      }

      currentDate = this.$moment(currentDate).add(1, 'days')
      while (currentDate < stopDate) {
        dateArray.push(this.$moment(currentDate).format('YYYY-MM-DD'))
        currentDate = this.$moment(currentDate).add(1, 'days')
      }
      return dateArray
    },
    setDateByUnit(number = 0, unit) {
      let date_render = this.renderDate(number, unit)
      this.$set(this.dates, '0', date_render.from.format('YYYY-MM-DD'))
      if (unit) {
        this.$set(this.dates, '1', date_render.to.format('YYYY-MM-DD'))
        this.selectedArray = this.getDaysArray(this.dates[0], this.dates[1])
      } else if (this.dates.length > 1) {
        this.selectedArray.length = 0
        this.dates.pop()
      }
      //
      this.emmit()
    },
    renderDate(number, unit = 'day') {
      let from,
        to = null
      let now = this.$moment()
      now = now.add(number, unit)
      unit = unit == 'week' ? 'isoWeek' : unit
      switch (unit) {
        case 'day':
          from = now
          to = now
          break
        case 'week':
        case 'isoWeek':
        case 'month':
        case 'year':
          from = now.startOf(unit)
          to = now.clone().endOf(unit)
          break
        default:
          break
      }
      return { from, to }
    },
    isActive(number = 0, unit = 'day') {
      let date_render = this.renderDate(number, unit)
      date_render.from = date_render.from.format('YYYY-MM-DD')
      date_render.to = date_render.to.format('YYYY-MM-DD')
      let dates_sorted = [...this.dates, ...[]]
      if (this.dates && this.dates.length >= 2) {
        if (this.$moment(this.dates[0], 'YYYY-MM-DD').isAfter(this.dates[1])) {
          dates_sorted = [this.dates[1], this.dates[0]]
        }
      } else if (this.dates && this.dates.length === 1) {
        dates_sorted = [this.dates[0], this.dates[0]]
      }
      if (
        date_render.from === dates_sorted[0] &&
        date_render.to === dates_sorted[1]
      ) {
        return true
      }
      return false
    },
    emmit() {
      let dates_sorted = {}

      if (this.dates && this.dates.length >= 2) {
        if (this.$moment(this.dates[0], 'YYYY-MM-DD').isAfter(this.dates[1])) {
          this.$set(dates_sorted, 'from', this.dates[1])
          this.$set(dates_sorted, 'to', this.dates[0])
          this.value_data = [this.dates[1], this.dates[0]]
        } else {
          this.$set(dates_sorted, 'from', this.dates[0])
          this.$set(dates_sorted, 'to', this.dates[1])
          this.value_data = [this.dates[0], this.dates[1]]
        }
      } else if (this.dates && this.dates.length === 1) {
        this.$set(dates_sorted, 'from', this.dates[0])
        this.$set(dates_sorted, 'to', this.dates[0])
        this.value_data = [this.dates[0]]
      } else {
        this.value_data = null
      }
      this.$emit('input', dates_sorted)
      this.$emit('change', dates_sorted)
      this.menu = false
    },
    cancel() {
      this.menu = false
    },
    clear() {
      this.selectedArray.length = 0
      this.$emit('input', this.clearReturn ? {} : null)
      this.$emit('change', this.clearReturn ? {} : null)
    }
  },
  mounted() {
    this.updateValueData(this.value)
  }
}
</script>
<style>
.date-range-picker .v-date-picker-table__event {
  bottom: 0px;
  height: 32px;
  left: 17%;
  z-index: -1;
  position: absolute;
  width: 32px;
  border: 1px solid #000;
  opacity: 0.1;
}
</style>
<template>
	<v-menu
		:close-on-content-click="false"
		full-width
		max-width="600px"
		offset-y
		transition="slide-y-transition"
		v-model="show"
	>
		<template v-slot:activator="{ on }">
			<v-text-field
				:value="displayText"
				@click:clear="clear"
				append-icon="$vuetify.icons.dropdown"
				clearable
				no-title
				readonly
				v-bind="$attrs"
				v-on="on"
			></v-text-field>
		</template>

		<v-card class="v-date-range-picker" tile>
			<v-layout row>
				<v-flex class="hidden-sm-and-down">
					<v-card flat>
						<v-card-text>
							<v-btn
								:key="item.name"
								@click="setDateRange(item)"
								block
								class="mb-2"
								text
								v-for="item in shortcuts"
							>{{item.name}}</v-btn>
						</v-card-text>
					</v-card>
				</v-flex>
				<v-flex d-flex>
					<v-card flat>
						<v-card-actions class="px-3">
							<v-flex>
								<v-btn block large outlined>{{ fromTemp || 'from'}}</v-btn>
							</v-flex>
							<v-flex>
								<v-btn block large outlined>{{ toTemp || 'to' }}</v-btn>
							</v-flex>
						</v-card-actions>
						<v-card-text>
							<v-date-picker
								:events="selectedRangeEvents"
								@input="onChange"
								full-width
								multiple
								no-title
								v-bind="attrs"
								v-model="dates"
							></v-date-picker>
						</v-card-text>
						<v-card-actions class="px-3">
							<v-spacer></v-spacer>
							<v-btn @click="close()" large text>Cancel</v-btn>
							<v-btn @click="submit()" class="ml-3" color="success" large>OK</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-card>
	</v-menu>
</template>

<script>
import shortcuts from './items'
export default {
  name: 'VDateRangePicker',
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    from: {
      type: String
    },
    to: {
      type: String
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      show: false, // Ẩn/hiện menu
      dates: [],
      shortcuts
    }
  },
  watch: {
    show(val) {
      if (val) {
        // Cập nhật biến tạm thời gian
        this.reset()
        this.dates.push(this.from)
        this.dates.push(this.to)
      }
    }
  },
  computed: {
    opts() {
      return {
        locale: this.options.locale || 'en',
        format: this.options.format || 'YYYY-MM-DD',
        firstDayOfWeek: this.options.firstDayOfWeek || 0
      }
    },
    attrs() {
      return {
        'first-day-of-week': this.opts.firstDayOfWeek,
        locale: this.opts.locale
      }
    },
    fromTemp() {
      return new Date(this.dates[0]) < new Date(this.dates[1])
        ? this.dates[0]
        : this.dates[1]
    },
    toTemp() {
      return new Date(this.dates[0]) > new Date(this.dates[1])
        ? this.dates[0]
        : this.dates[1]
    },
    // Text hiển thị trong textfield
    displayText() {
      return this.from && this.to ? `${this.from}    -    ${this.to}` : ''
    }
  },
  methods: {
    selectedRangeEvents(val) {
      return (
        this.$moment(val).isSameOrAfter(this.fromTemp) &&
        this.$moment(val).isSameOrBefore(this.toTemp)
      )
    },
    // Chọn ngày nhanh
    onChange(dates) {
      if (dates.length > 2) {
        dates.shift()
        console.log(dates)
      }
    },
    setDateRange(data) {
      this.reset()
      // Lấy ngày hiện tại
      let date = this.$moment().add(data.number, data.unit)
      // Lưu lại biến unit
      let unit = data.unit
      let from = null
      let to = null
      switch (data.unit) {
        case 'days':
          from = date
          to = date
          break
        case 'weeks':
          // Cập nhật lại biến unit nếu trường hợp thứ 2 là ngày đầu tuần
          unit = this.opts.firstDayOfWeek === 1 ? 'isoWeek' : 'week'
        case 'months':
        case 'years':
          // Nếu thiết lập thứ đầu tiên là thứ 2, thì staftOf dùng isoWeek
          from = date.startOf(unit)
          to = date.clone().endOf(unit)
          break
      }
      this.dates.push(from.format('YYYY-MM-DD'))
      this.dates.push(to.format('YYYY-MM-DD'))
      this.submit()
    },
    reset() {
      this.dates = []
    },

    clear() {
      this.$emit('input', {
        from: null,
        to: null
      })
      this.$emit('update:from', null)
      this.$emit('update:to', null)
    },
    submit() {
      // Cập nhật v-model
      this.$emit('input', {
        from: this.fromTemp,
        to: this.toTemp
      })
      // Sync biến From và To
      this.$emit('update:from', this.fromTemp)
      this.$emit('update:to', this.toTemp)

      this.close()
    },
    close() {
      this.show = false
    }
  },
  mounted() {
    // this.opts = Object.assign({}, this.opts, this.options)
  }
}
</script>
<style>
.v-date-range-picker .v-date-picker-table__events {
  height: 0;
}
.v-date-range-picker .v-date-picker-table--date .v-date-picker-table__events {
  top: 0;
}
.v-date-range-picker .v-date-picker-table__events > div {
  height: 32px;
  width: 32px;
  opacity: 0.1;
}
</style>

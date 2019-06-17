<template>
	<v-menu
		:close-on-content-click="false"
		full-width
		min-width="750px"
		offset-y
		transition="slide-y-transition"
		v-model="menu"
	>
		<template v-slot:activator="{ on }">
			<v-text-field
				:value="displayText"
				@click:clear="clear"
				clearable
				readonly
				v-bind="$attrs"
				v-on="on"
			></v-text-field>
		</template>

		<v-card class="v-date-range-picker">
			<v-layout row wrap>
				<v-flex class="hidden-sm-and-down pa-2" shrink>
					<v-btn
						:key="item.name"
						@click="setDateRange(item)"
						block
						class="mb-2"
						text
						v-for="item in items"
					>{{item.name}}</v-btn>
				</v-flex>
				<v-flex class="pt-2">
					<v-layout row wrap>
						<v-flex xs6>
							<v-date-picker
								:events="selectedRangeEvents"
								:first-day-of-week="defaultOptions.firstDayOfWeek"
								:locale="defaultOptions.locale"
								:max="toTemp"
								:show-current="false"
								v-model="fromTemp"
							></v-date-picker>
						</v-flex>
						<v-flex xs6>
							<v-date-picker
								:events="selectedRangeEvents"
								:first-day-of-week="defaultOptions.firstDayOfWeek"
								:locale="defaultOptions.locale"
								v-model="toTemp"
							></v-date-picker>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="close()" text>Cancel</v-btn>
				<v-btn :disabled="!(fromTemp && toTemp)" @click="submit()" color="success">OK</v-btn>
			</v-card-actions>
		</v-card>
	</v-menu>
</template>

<script>
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
      menu: false, // Ẩn/hiện menu
      fromTemp: null,
      toTemp: null,
      today: this.$moment(),
      defaultOptions: {
        locale: 'en',
        format: 'YYYY-MM-DD',
        firstDayOfWeek: 0
      },
      items: [
        {
          name: 'Today',
          number: 0,
          unit: 'days'
        },
        {
          name: 'Yesterday',
          number: -1,
          unit: 'days'
        },
        {
          name: 'This week',
          number: 0,
          unit: 'weeks'
        },
        {
          name: 'Last week',
          number: -1,
          unit: 'weeks'
        },
        {
          name: 'This month',
          number: 0,
          unit: 'months'
        },
        {
          name: 'Last month',
          number: -1,
          unit: 'months'
        },
        {
          name: 'This year',
          number: 0,
          unit: 'years'
        }
      ]
    }
  },
  watch: {
    menu(val) {
      if (val) {
        // Cập nhật biến tạm thời gian
        this.fromTemp = this.from
        this.toTemp = this.to || this.today.format(this.defaultOptions.format)
      }
    },
    toTemp(val) {
      // Nếu from > to thì xóa from
      if (!this.$moment(this.fromTemp).isSameOrBefore(this.toTemp)) {
        this.fromTemp = null
      }
    }
  },
  computed: {
    // Text hiển thị trong textfield
    displayText() {
      return this.from && this.to ? `${this.from} → ${this.to}` : ''
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
    setDateRange(data) {
      let date = this.today.clone().add(data.number, data.unit)
      let from,
        to = null
      switch (data.unit) {
        case 'days':
          from = to = date
          break
        case 'weeks':
        case 'months':
        case 'years':
          // Nếu thiết lập thứ đầu tiên là thứ 2, thì staftOf dùng isoWeek
          data.unit =
            this.defaultOptions.firstDayOfWeek === 1 ? 'isoWeek' : 'week'
          from = date.startOf(data.unit)
          to = date.clone().endOf(data.unit)

          break
      }
      console.log(this.defaultOptions.format)

      this.fromTemp = from.format(this.defaultOptions.format)
      this.toTemp = to.format(this.defaultOptions.format)

      this.submit()
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
      this.menu = false
    }
  },
  mounted() {
    this.defaultOptions = Object.assign({}, this.defaultOptions, this.options)
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

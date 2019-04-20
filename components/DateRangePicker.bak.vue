<template>
  <v-menu offset-y full-width :close-on-content-click="false" min-width="800" v-model="show">
    <v-text-field readonly label="Date" name="name" slot="activator" hide-details single-line :value="dateString" :prepend-icon="prependIcon" clearable></v-text-field>
    <v-card class="d-flex">
      <v-layout row wrap>
        <v-flex xs3 class="white">
          <v-layout column>
            <v-btn v-for="item in sorts" :key="item.name" flat :color="isActive(item.number,item.unit)?'green':'grey darken-3'" @click="setDateByUnit(item.number,item.unit)">{{item.name}}</v-btn>
          </v-layout>
        </v-flex>
        <v-flex xs9 d-flex>
          <v-date-picker :first-day-of-week="1" v-model="date.from"></v-date-picker>
          <v-date-picker :first-day-of-week="1" v-model="date.to"></v-date-picker>
        </v-flex>
        <v-flex xs12>
          <v-toolbar color="white">
            <v-spacer></v-spacer>
            <v-btn color="success" @click="show=false">OK</v-btn>
          </v-toolbar>
        </v-flex>
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "VDateRangePicker",
  props: {
    value: {
      type: Object,
      required: false,
      default: () => {
        return {
          from: this.$moment().format("YYYY-MM-DD"),
          to: this.$moment().format("YYYY-MM-DD")
        };
      }
    },
    defaultSort: {
      type: Object,
      required: false,
      default: () => {
        return null;
      }
    },
    prependIcon: {
      type: String,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      show: false,
      select: "",
      date: this.value,
      format: "YYYY-MM-DD",
      sorts: [
        {
          name: "Today",
          number: undefined,
          unit: undefined
        },
        {
          name: "Yesterday",
          number: -1,
          unit: undefined
        },
        {
          name: "This week",
          number: 0,
          unit: "week"
        },
        {
          name: "Last week",
          number: -1,
          unit: "week"
        },
        {
          name: "This month",
          number: 0,
          unit: "month"
        },
        {
          name: "Last month",
          number: -1,
          unit: "month"
        },
        {
          name: "This year",
          number: 0,
          unit: "year"
        }
      ]
    };
  },
  watch: {
    show(val) {
      if (!val) {
        this.$emit("change", this.date);
      }
    },
    date: {
      handler(newval) {
        this.$emit("input", newval);
      },
      deep: true
    },
    value: {
      handler(val) {
        this.date = val;
      },
      deep: true
    }
  },
  computed: {
    dateString() {
      return this.date.from && this.date.to
        ? this.date.from + " - " + this.date.to
        : "";
    }
  },
  methods: {
    setDate(from, to) {
      this.date.from = from.format(this.format);
      this.date.to = to.format(this.format);
      this.$emit("input", this.date);
    },
    /**
    @augments  Thiết lập thời gian theo tham số truyền vào. 
    @field number: Số đơn vị thay đổi
    @field unit: day|week|month|year - Mặc định là day
     */
    setDateByUnit(number = 0, unit = "day") {
      let date_render = this.renderDate(number, unit);
      this.setDate(date_render.from, date_render.to);
    },
    renderDate(number, unit) {
      let from,
        to = null;
      let now = this.$moment();
      now = now.add(number, unit);
      unit = unit == "week" ? "isoWeek" : unit;
      switch (unit) {
        case "day":
          from = now;
          to = now;
          break;
        case "week":
        case "isoWeek":
        case "month":
        case "year":
          from = now.startOf(unit);
          to = now.clone().endOf(unit);
          break;
        default:
          break;
      }
      return { from, to };
    },
    isActive(number = 0, unit = "day") {
      let date_render = this.renderDate(number, unit);
      date_render.from = date_render.from.format(this.format);
      date_render.to = date_render.to.format(this.format);
      if (JSON.stringify(date_render) === JSON.stringify(this.date)) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    if (this.defaultSort) {
      this.setDateByUnit(this.defaultSort.number, this.defaultSort.unit);
    }
  }
};
</script>

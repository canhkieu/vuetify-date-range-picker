# Guild

## Install

Note: This plugin used momentjs to format date. Please install vue-moment, too.

```
npm i v-date-range-picker vue-moment
or
yarn add v-date-range-picker vue-moment
```

## Setup

```
main.js

import VDateRangePicker from 'v-date-range-picker'
Vue.use(VDateRangePicker)

Vue.use(require('vue-moment'))
```

## Use

```
<v-date-range-picker :from.sync="from" :to.sync="to"/>
or
<v-date-range-picker v-model="date"/>
```

## Use with props

```
<v-date-range-picker v-model="date" label="Select date ranged" solo/>
```

- See more: https://vuetifyjs.com/en/components/text-fields#api

## Use with options

```
<v-date-range-picker v-model="date" :options="{locale:vi, firstDayOfWeek:1}"/>
```

### Options default

- locale: 'us'
- firstDayOfWeek: 0 // 0:sunday, 1:monday,...

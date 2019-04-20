# Guild

## Install

```
npm i v-date-range-picker
or
yarn add v-date-range-picker
```

## Setup

```
main.js

import VDateRangePicker from 'v-date-range-picker'
Vue.use(VDateRangePicker)

```

## Use

```
<v-date-range-picker :from.sync="from" :to.sync="to"/>
or
<v-date-range-picker v-model="date"/>
```

## Use with options

```
<v-date-range-picker v-model="date" :options="{locale:vi}"/>
```

## Use with props

```
<v-date-range-picker v-model="date" label="Select date ranged" solo/>
```

- See more: https://vuetifyjs.com/en/components/text-fields#api

### Options default

- locale: 'us',

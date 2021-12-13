<template>
  <div class="feed-page">
    <div class="right-column py-5">
      <div class="columns has-text-centered my-0">
        <div class="column">
          <a
            :class="[topTab == 'bullish' && 'has-text-weight-bold']"
            href="#"
            @click.prevent="topTab = 'bullish'"
            >Most Bullish</a
          >
        </div>
        <div class="column">
          <a
            :class="[topTab == 'bearish' && 'has-text-weight-bold']"
            href="#"
            @click.prevent="topTab = 'bearish'"
            >Most Bearish</a
          >
        </div>
      </div>
      <div
        v-for="signal in topSignals"
        :key="`top-signal-${signal.created_at}-${signal.attributes.ticker}`"
        class="right-column-card mx-auto my-3 columns p-3 has-text-centered"
      >
        <div class="column">
          <p>Ticker</p>
          <p
            :class="[
              signal.attributes.strength > 0 && 'gain',
              signal.attributes.strength < 0 && 'loss',
              signal.attributes.strength === 0 && 'neutral',
              'has-text-weight-bold',
              'mt-2',
            ]"
          >
            {{ signal.attributes.ticker }}
          </p>
        </div>
        <div class="column">
          <p>Last</p>
          <p class="white has-text-weight-bold mt-2">
            {{ formatMoney(signal.attributes.close) }}
          </p>
        </div>
        <div class="column">
          <p>G/L</p>
          <p class="white has-text-weight-bold mt-2">
            {{
              signal.attributes.change != null
                ? signal.attributes.change.toFixed(2)
                : '--'
            }}%
          </p>
        </div>
        <section class="b-tooltips">
          <b-tooltip label="Strength = Bullish Signals - Bearish Signals"position="is-right">
            <div class="column">
              <p>Strength
                <!-- <b-icon icon="question-mark-circle-outline" size="is-small"></b-icon> -->
              </p>
              <p
                :class="[
                  signal.attributes.strength > 0 && 'gain',
                  signal.attributes.strength < 0 && 'loss',
                  signal.attributes.strength === 0 && 'neutral',
                  'has-text-weight-bold',
                  'mt-2',
                ]"
              >
                {{
                  signal.attributes.strength != null
                    ? signal.attributes.strength
                    : '--'
                }}
              </p>
            </div>
          </b-tooltip>
        </section>
      </div>
    </div>
    <div class="mt-5 mb-1" style="padding-left: 16px; padding-right: 16px">
      <div class="mb-5">
        <div class="is-flex-tablet is-align-items-center">
          <div class="is-flex-grow-1">
            <h1 class="title is-4">{{ localTime }} (Local Time)</h1>
          </div>
          <div class="my-3">
            <span class="white mr-3">Analysis:</span>
            <a
              v-for="windowOption in windowOptions"
              :key="windowOption.value"
              href="#"
              :class="[
                'mr-3',
                selectedWindow == windowOption.value && 'has-text-weight-bold',
              ]"
              @click.prevent="selectWindow(windowOption.value)"
            >
              {{ windowOption.label }}
            </a>
          </div>
        </div>
      </div>
      <div class="columns">
        <b-field label="" class="column is-two-thirds">
          <b-taginput
            v-model="selectedTickers"
            autocomplete
            :data="filteredTags"
            field="attributes.ticker"
            icon="magnify"
            placeholder="Search Symbol"
            rounded
            @typing="getFilteredTags"
            @input="handleInputTags"
          ></b-taginput>
        </b-field>
        <b-field class="column">
          <b-dropdown
            v-model="selectedPatterns"
            multiple
            expanded
            close-on-click
            aria-role="list"
            @change="fetchSignals"
          >
            <template #trigger>
              <b-input
                :value="selectedPatterns.join(', ')"
                icon-right="chevron-down"
                expanded
                placeholder="Filter by indicator"
              ></b-input>
            </template>
            <b-dropdown-item
              v-for="pattern in patterns"
              :key="pattern"
              :value="pattern"
              aria-role="listitem"
            >
              <span>{{ pattern }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
      </div>
      <div>
        <table class="signals-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ticker</th>
              <th>Price</th>
              <th>Gain/Loss</th>
              <th>Sentiment</th>
              <!-- <th>Strength</th> -->
              <!-- <th>Type</th> -->
              <th colspan="2">Indicator</th>
              <th>Avg 3d perf.</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in tableData"
              :key="`signal-${row.time}-${row.ticker}-${row.indicator}`"
              class="signal-row"
            >
              <td>{{ row.time }}</td>
              <td>{{ row.ticker }}</td>
              <td>{{ row.price }}</td>
              <td>{{ row.gain_loss }}%</td>
              <td
                :class="[
                  row.sentiment === 'Bullish' && 'gain',
                  row.sentiment === 'Bearish' && 'loss',
                  row.sentiment === 'Contextual' && 'contextual',
                ]"
              >
                {{ row.sentiment }}
              </td>
              <!-- <td>{{ row.strength }}</td> -->
              <!-- <td>{{ row.type }}</td> -->
              <td colspan="2">{{ row.indicator }}</td>
              <td>{{ row.avg_3d_perf }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { format, parseISO } from 'date-fns'
import { unsetToken } from '~/util/auth'
import api from '~/services/api'

export default {
  name: 'HomePage',
  components: {},
  data() {
    return {
      clockTimer: null,
      signalTimer: null,
      isLoading: false,
      localTime: format(new Date(), 'MMM d, y - pp'),
      topBullish: [],
      topBearish: [],
      selectedWindow: 1440,
      signals: [],
      selectedTickers: [],
      selectedPatterns: [],
      tickers: [],
      filteredTags: [],
      windowOptions: [
        // { value: 1, label: '1 min' },
        { value: 7200, label: 'Weekly Bars' },
        { value: 1440, label: 'Daily Bars' },
        // { value: 5, label: '5 mins' },
      ],
      topTab: 'bullish',
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.$store.state.user.profile
    },
    tableData() {
      return this.signals.map((signal) => {
        return {
          time: this.formatTimeFromDate(signal.attributes.created_at),
          ticker: signal.attributes.ticker,
          price: this.formatMoney(signal.attributes.close),
          gain_loss: signal.attributes.change
            ? signal.attributes.change.toFixed(2)
            : '--',
          sentiment: signal.attributes.sentiment,
          strength: signal.attributes.strength
            ? signal.attributes.strength
            : '--',
          type: signal.attributes.pattern_type,
          indicator: signal.attributes.pattern,
          avg_3d_perf: signal.attributes.avg_3d_perf
            ? signal.attributes.avg_3d_perf.toFixed(2)
            : '--',
        }
      })
    },
    patterns() {
      const patterns = this.signals.map((signal) => signal.attributes.pattern)
      return [...new Set(patterns)]
    },
    topSignals() {
      return this.topTab === 'bullish' ? this.topBullish : this.topBearish
    },
  },
  created() {
    this.runClock()
    this.fetchSignalsAndTimeout()
    this.fetchStocks()
  },
  unmounted() {
    clearTimeout(this.clockTimer)
    clearTimeout(this.signalTimer)
  },
  methods: {
    ...mapMutations({
      setProfile: 'user/setProfile',
    }),
    logout() {
      unsetToken()
      this.setProfile(null)
      this.$router.push('/')
    },
    formatMoney(amount) {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    },
    formatTimeFromDate(date) {
      date = date + 'Z'
      return format(parseISO(date), 'MMM d, y')
    },
    selectWindow(windowMins) {
      this.selectedWindow = windowMins
      this.fetchSignals()
      this.fetchTopBullish()
      this.fetchTopBearish()
    },
    runClock() {
      this.localTime = format(new Date(), 'MMM d, y - pp')
      this.clockTimer = setTimeout(this.runClock, 500)
    },
    fetchSignalsAndTimeout() {
      this.fetchSignals()
      this.fetchTopBullish()
      this.fetchTopBearish()
      this.signalTimer = setTimeout(this.fetchSignalsAndTimeout, 10000)
    },
    handleInputTags() {
      this.selectedPatterns = []
      this.fetchSignals()
    },
    async fetchSignals() {
      this.isLoading = true

      try {
        const response = await api.get(
          `/stocks/signals?window_mins=${
            this.selectedWindow
          }&tickers=${this.selectedTickers
            .map((option) => {
              return option.attributes.ticker
            })
            .join(',')}`
        )
        let signals = response.data.data
        if (this.selectedPatterns.length) {
          signals = signals.filter((signal) =>
            this.selectedPatterns.includes(signal.attributes.pattern)
          )
        }
        this.signals = signals
      } catch (err) {
        if (err && err.response && err.response.status === 401) {
          this.logout()
        }

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.errors
        ) {
          this.errorMessage = err.response.data.errors.join(' ')
        } else {
          this.errorMessage = 'An unknown error has occurred.'
        }
      } finally {
        this.isLoading = false
      }
    },
    async fetchTopBullish() {
      try {
        const response = await api.get(
          `/stocks/top-gainers?window_mins=${this.selectedWindow}&limit=25`
        )
        this.topBullish = response.data.data
      } catch (err) {
        // Ignore
      }
    },
    async fetchTopBearish() {
      try {
        const response = await api.get(
          `/stocks/top-losers?window_mins=${this.selectedWindow}&limit=25`
        )
        this.topBearish = response.data.data
      } catch (err) {
        // Ignore
      }
    },
    async fetchStocks() {
      try {
        const response = await api.get(`/stocks/tickers`)
        this.tickers = response.data.data
      } catch (err) {
        // Ignore
      }
    },
    getFilteredTags(text) {
      this.filteredTags = this.tickers.filter((option) => {
        return option.attributes.ticker
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase())
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.feed-page {
  display: flex;
}

.b-tooltips {
    .b-tooltip:not(:last-child) {
        margin-right: .5em
    }
}

.signals-table {
  table-layout: fixed;
  text-align: left;
  width: 100%;

  th,
  td {
    padding: 12px;
  }
}

.signal-row {
  background-color: #121117;
  border-bottom: #000000 16px solid;
  border-top: #000000 16px solid;
  color: #ffffff;
  font-weight: bold;
  margin: 16px 0;
}

.white {
  color: #fff;
}

.gain {
  color: #4dff94;
}

.loss {
  color: #ff4078;
}

.neutral {
  color: #6966ff;
}

.contextual {
  color: #ff59dd;
}

.right-column {
  background-color: #000000;
  min-height: 100vh;
  min-width: 385px;
}

.right-column-card {
  background-color: #121117;
  border-radius: 5px;
  max-width: 360px;
}
</style>

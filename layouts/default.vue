<template>
  <div>
    <nav v-if="isLoggedIn" class="app-nav">
      <img src="~/assets/images/Logo_mark.svg" />
      <a href="#" @click.prevent="logout">
        <b-icon icon="power-standby"></b-icon>
      </a>
    </nav>
    <div style="padding-left: 64px">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { unsetToken } from '~/util/auth'

export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
      ],
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.$store.state.user.profile
    },
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
  },
}
</script>

<style>
body {
  background-color: #000;
  font-size: 12px;
  min-height: 100vh;
}

body,
.title,
table th {
  color: #626262;
}

a {
  color: #fff;
}

a:hover {
  color: #ddd;
}
</style>

<style lang="scss" scoped>
.app-nav {
  background-color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  left: 0;
  padding: 16px;
  position: fixed;
  text-align: center;
  top: 0;
}
</style>

<template>
  <form
    class="container px-3"
    style="max-width: 600px; margin: auto; padding-top: 80px"
    @submit.prevent="signIn"
  >
    <div style="text-align: center">
      <img class="my-5" src="~/assets/images/Full_logo.svg" />
    </div>
    <b-field label="Email">
      <b-input v-model="email" type="email"></b-input>
    </b-field>
    <b-field label="Password">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <b-message v-if="errorMessage" type="is-danger">
      {{ errorMessage }}
    </b-message>
    <b-button
      type="is-primary-dark"
      native-type="submit"
      :disabled="isLoading"
      expanded
      >Sign in</b-button
    >
    <b-field
      id="by"
      label="By signing in, you agree to be bound by StormIQ's Legal Disclaimer:"
    >
      <a
        href="/disclaimer"
        style="color: #0645ad; font-size: 14px"
        target="_blank"
        rel="noopener noreferrer"
      >
        Legal Dislaimer
      </a>
    </b-field>
    <b-field class="smallText" id="signUpLink">
      <a
        href="/signup"
        style="color: green; font-size: 16px"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sign Up
      </a>
    </b-field>
    <b-field class="smallText" id="signUpLink">
      <a
        href="/resetPasswd"
        style="color: green; font-size: 16px"
        target="_blank"
        rel="noopener noreferrer"
      >
        reset password
      </a>
    </b-field>
  </form>
</template>

<script>
import { mapMutations } from 'vuex'
import api from '~/services/api'

export default {
  data() {
    return {
      email: null,
      errorMessage: null,
      isLoading: false,
      password: null,
    }
  },
  head: {
    script: [
      // This is an early executing script that will redirect the user to the
      // home feed if they are attempting to reach the home page and they have
      // an auth token and are logged in. We are inlining this so it executes
      // immediately with no network lag.
      {
        innerHTML: `
(function(w, ls) {
  if (!w || !ls || w.location.pathname !== '/') return;
  if (ls.getItem('auth_token')) w.location = '/feed';
})(window, localStorage);`,
        type: 'text/javascript',
      },
    ],
    // This is necessary to inline the above redirect script.
    __dangerouslyDisableSanitizers: ['script'],
  },
  methods: {
    ...mapMutations({
      setProfile: 'user/setProfile',
    }),
    async signIn() {
      if (!this.email || !this.password) {
        this.errorMessage = 'Please enter an email and password.'
        return
      }

      this.errorMessage = null
      this.isLoading = true
      console.log(this.email)
      console.log(this.password)
      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password,
        })
        this.setProfile(response.data.data)
        this.$router.push('/feed')
      } catch (err) {
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
  },
}
</script>
<style scoped>
#signUpLink {
  text-align: center;
}
button {
  margin-bottom: 20px;
  font-weight: bold;
  background-color: green;
  border-color: green;
}
</style>

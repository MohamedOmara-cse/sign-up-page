<template>
  <form
    class="container px-3"
    style="max-width: 600px; margin: auto; padding-top: 80px"
    @submit.prevent="signUp"
  >
    <div style="text-align: center">
      <img class="my-5" src="~/assets/images/Full_logo.svg" />
    </div>
    <div id="Paragraph" style="text-align: center; color: white">
      <p>Create an account</p>
    </div>
    <b-field label="First Name">
      <b-input v-model="firstName" reqi type="text" required></b-input>
    </b-field>
    <b-field label="Last Name">
      <b-input v-model="lastName" type="text" required></b-input>
    </b-field>
    <b-field label="Email">
      <b-input v-model="email" type="email" required></b-input>
    </b-field>
    <b-field label="Create a Password">
      <b-input v-model="password" type="password" password-reveal required>
      </b-input>
    </b-field>
    <b-message v-if="errorMessage" type="is-danger">
      {{ errorMessage }}
    </b-message>
    <b-checkbox
      type="checkbox"
      value="checked"
      id="checkbox"
      v-model="checked"
      required
    ></b-checkbox>
    <label for="checkbox"
      >I have read and agree to StormIQ's
      <a
        href="/disclaimer"
        style="color: #0645ad; font-size: 20px"
        target="_blank"
        rel="noopener noreferrer"
      >
        Legal Dislaimer
      </a>
    </label>
    <b-button
      type="is-primary-dark"
      native-type="submit"
      :disabled="isLoading"
      expanded
      >Sign Up
    </b-button>
    <b-field>
      <a
        href="/resetPasswd"
        style="color: #0645ad; font-size: 16px"
        target="_blank"
        rel="noopener noreferrer"
      >
        reset password
      </a>
    </b-field>
  </form>
</template>

<script>
import api from '~/services/api'

export default {
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      errorMessage: null,
      isLoading: false,

      checked: '',
    }
  },

  methods: {
    async signUp() {
      console.log(this.firstName)
      console.log(this.lastName)
      console.log(this.email)
      console.log(this.password)
      this.isLoading = true
      try {
        const response = await api.post('/auth/register', {
          firstName: this.firstName,
          lastName: this.lastName,
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
button {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: bold;
  background-color: green;
  border-color: green;
}
</style>

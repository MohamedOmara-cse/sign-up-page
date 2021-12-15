<template>
  <form
    class="container px-3"
    style="max-width: 1000px; margin: auto; padding-top: 80px"
    @submit.prevent="resetPasswd"
  >
    <div style="text-align: center">
      <img class="my-5" src="~/assets/images/Full_logo.svg" />
    </div>
    <div id="Paragraph" style="text-align: center; color: white">
      <p>Forget your Password?</p>
    </div>
    <div
      style="font-size: 18px; margin: 20px; text-align: center; color: white"
    >
      <p>
        it happens, Enter your email below and we will send you a reset link.
      </p>
      <p id="verificationSent">{{ message }}</p>
    </div>
    <b-field id="emailDev" label="Email">
      <b-input v-model="email" type="email" required></b-input>
    </b-field>
    <b-button
      type="is-primary-dark"
      native-type="submit"
      :disabled="isLoading"
      expanded
      >Send me a reset link
    </b-button>
    <b-field id="backToLogin">
      <a
        href="/"
        style="color: wight; font-size: 16px"
        target="_blank"
        rel="noopener noreferrer"
      >
        Back to Sign in
      </a>
    </b-field>
  </form>
</template>

<script>
import api from '~/services/api'

export default {
  data() {
    return {
      email: null,
      message: '',
      isLoading: false,
    }
  },
  methods: {
    async resetPasswd() {
      this.message = 'Your reset email is on its way .Check your inbox'

      this.isLoading = true
      try {
        const response = await api.post('/auth/reset-password', {
          email: this.email,
        })
        this.email = null
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
#emailDev {
  margin-top: 30px;
}
button {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: bold;
  background-color: green;
  border-color: green;
}
#backToLogin {
  text-align: center;
  margin: 15px;
}
#verificationSent {
  margin-top: 20px;
  color: green;
}
</style>

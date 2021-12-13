/**
 * @fileoverview
 * This adds some top-level functionality to the Vue app that should always fire
 * regardless of the layout or the page being used.
 */
import { mapMutations } from 'vuex'
import api from '~/services/api'

export default function ({ app }) {
  app.mixins = app.mixins || []
  app.mixins.push({
    created() {
      this.fetchUserProfile()
    },
    methods: {
      ...mapMutations({
        setProfile: 'user/setProfile',
      }),
      async fetchUserProfile() {
        try {
          const response = await api.get('/auth/profile')
          const profile = response.data.data
          this.setProfile(profile)
        } catch (err) {
          // TODO(matthewm) Handle errors
        }
      },
    },
  })
}

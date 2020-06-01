<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import login from './graphql/login.gql'
export default {
  data: () => ({
    email: '',
    password: '',
    user: null,
    loading: false
  }),
  methods: {
    async login() {
      this.loading = true
      try {
        this.user = await this.$apollo.mutate({
          mutation: login,
          variables: {
            email: this.email,
            password: this.password
          }
        })

        if (this.user) this.loading = false
      } catch (err) {
        this.loading = false
        console.log(err.graphQLErrors)
      }
    }
  }
}
</script>

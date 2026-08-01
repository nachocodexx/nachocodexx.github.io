import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apollo = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Likes: {
          keyFields: ['postId', 'userId'],
        },
        Posts: {
          keyFields: ['id'],
        },
        User: {
          keyFields: ['userId'],
        },
      },
    }),
    link: new HttpLink({
      credentials: 'omit',
      uri: config.public.graphqlUrl,
    }),
  })

  return {
    provide: {
      apollo,
    },
  }
})

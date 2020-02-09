
export const envName = {
  production: 'production',
  dev: 'dev'
}

export const env = envName.production

export default {
  dev: {
    host: '/api/v3',
    shareHost: '/share.html'
  },
  production: {
  //  host: '/api/v1',
    host: '/api/v3',
    shareHost: '/share.html'
  }
}

module.exports = {
  devServer: {
    port: 5050
  },
  transpileDependencies: ['quasar'],
  pluginOptions: {
    apollo: {
      lintGQL: true
    },
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-svg-inline-loader')
      .loader('vue-svg-inline-loader')
      .end()
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  }
};

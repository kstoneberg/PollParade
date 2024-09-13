const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      // Options for `sass-loader` (SASS syntax)
      sass: {
        additionalData: `@import "@/styles/variables.sass"`
      },
      // Options for `sass-loader` (SCSS syntax)
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      },
    },
  },
})

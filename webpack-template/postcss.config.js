// npm install postcss-loader autoprefixer css-mqpacker cssnano --save-dev

module.exports = {
    plugins: [
      require('autoprefixer'),
      require('cssnano')({
          preset: [
            'default', {
                discardComments: {
                    removeAll: true,
                }
            }  
          ]
      })
    ]
  }
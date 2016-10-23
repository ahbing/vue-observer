module.exports = {
  entry: './index.js',
  output: {
    path: './',
    filename: 'observer.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
const webpack = require("webpack")

var config = {
   entry: './webpack_files/entry.js',
   output: {
      path:'./',
      filename: 'public/index.js',
   },

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',

            query: {
               presets: ['es2015', 'react']
            }
         },
         {
           test: /\.scss$/,
           loaders: ["style-loader", "css-loader", "sass-loader"]
         }
      ]
   },
   plugins: [
     new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
     new webpack.optimize.DedupePlugin(),
     new webpack.optimize.UglifyJsPlugin(),
     new webpack.optimize.AggressiveMergingPlugin()
  ],
}

module.exports = config;

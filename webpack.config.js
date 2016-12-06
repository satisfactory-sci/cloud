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
   }
}

module.exports = config;

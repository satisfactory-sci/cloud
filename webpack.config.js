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
         }
      ]
   }
}

module.exports = config;
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Turns CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
    ],
  },
};

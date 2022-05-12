module.exports = {
  publicPath: "./",
  devServer: {
    host: "localhost",
    port: 8089,
    proxy: {
      "/": {
        target: "http://8.130.26.158:3000/",
        changeOrigin: true,
        pathRewrite: {
          "/": "",
        },
      },
    },
  },
};

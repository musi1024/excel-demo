const cdnBaseUrl = process.env.VUE_APP_CDN_URL || "./";

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? cdnBaseUrl : "/"
};
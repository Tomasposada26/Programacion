module.exports = {
  // ...existing config...
  ignoreWarnings: [
    {
      module: /jspdf[\\/]dist[\\/]jspdf\.es\.min\.js$/,
      message: /Failed to parse source map/,
    },
  ],
};
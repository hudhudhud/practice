var plugins = {
  "postcss-mpvue-wxss": {},
  "postcss-import": {},
  "postcss-url": {},
  // to edit target browsers: use "browserslist" field in package.json
  "autoprefixer": {}
};
if (process.argv[2] === "--h5" || process.argv[2] === "-h5") {
  delete plugins["postcss-mpvue-wxss"];
}
module.exports = {
  "plugins": plugins
}

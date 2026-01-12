const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const Dotenv = require('dotenv-webpack');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "grupo21",
    projectName: "shared-react",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    plugins: [
      new Dotenv()
    ],
    externals: [
      'react',
      'react-dom',
      /^react\/.+$/,
      /^react-dom\/.+$/
    ]
  });
};

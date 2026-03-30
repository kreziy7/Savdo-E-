module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      // WatermelonDB — @field, @date, @readonly decoratorlar uchun
      ["@babel/plugin-proposal-decorators", { legacy: true }],
    ],
  };
};

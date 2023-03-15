// https://browsersl.ist/
module.exports = {
  presets: [
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@vue/babel-plugin-jsx',
      {
        enableObjectSlots: true,
      },
    ],
  ],
};

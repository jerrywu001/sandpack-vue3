module.exports = { // https://juejin.cn/post/6901943749916491783
  plugins: [
    require('autoprefixer')({
      env: '.browserlistrc',
      flexbox: 'no-2009'
    }),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-nested'), // https://github.com/postcss/postcss-nested
    require('postcss-flexbugs-fixes'), // https://hub.fastgit.org/luisrudge/postcss-flexbugs-fixes
  ],
};

const fs = require('fs');
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');
const replace = require('rollup-plugin-replace');
const uglify = require('uglify-js');

const entries = [
  {
    format: 'cjs',
    file: './dist/index.common.js'
  },
  {
    format: 'es',
    file: './dist/index.esm.js'
  },
  {
    format: 'umd',
    name: 'VueI18nDevTools',
    file: './dist/index.js',
    env: 'production'
  },
  {
    format: 'umd',
    name: 'VueI18nDevTools',
    file: './dist/index.min.js',
    env: 'development'
  }
];

async function build(outputOptions) {
  const inputOptions = {
    input: './src/index.js',
    plugins: [
      babel({
        presets: [['@babel/env', { modules: false }]],
        exclude: 'node_modules/**',
        babelrc: false
      })
    ]
  };

  if (outputOptions.env) {
    inputOptions.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(outputOptions.env)
      })
    );

    delete outputOptions.env;
  }

  const bundle = await rollup.rollup(inputOptions);
  const { code } = await bundle.generate(Object.assign({}, outputOptions));
  let result = code;
  if (/min\.js$/.test(outputOptions.file)) {
    result = uglify.minify(code, {
      output: {
        ascii_only: true
      },
      compress: {
        pure_funcs: ['makeMap']
      }
    }).code;
  }

  fs.writeFileSync(outputOptions.file, result, 'utf8');
  console.log(`build ${outputOptions.file} success.`);
}

try {
  const stats = fs.statSync('./dist');
  if (!stats.isDirectory()) {
    console.error('dist is not a folder');
    return;
  }
} catch (e) {
  fs.mkdirSync('./dist');
}

entries.reduce((chain, e) => {
  return chain.then(() => {
    return build(e);
  });
}, Promise.resolve());

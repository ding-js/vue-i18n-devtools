module.exports = {
  chainWebpack: config => {
    // delete default entry
    config.entryPoints.delete('app');

    config
      .entry('devtools')
      .add('./src/devtools.js')
      .end();
    config
      .entry('origin')
      .add('./src/origin.js')
      .end();
  }
};

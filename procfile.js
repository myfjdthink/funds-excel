'use strict'

module.exports = (pandora) => {

  pandora
    .fork('funds-excel', './dist/main.js')
    .env({
      DEBUG: 'PandoraHook:*',
      NODE_ENV: 'development',
      PORT: '3008',
    })

  /**
   * you can also use cluster mode to start application
   */
  // pandora
  //   .cluster('./build/app.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */

}

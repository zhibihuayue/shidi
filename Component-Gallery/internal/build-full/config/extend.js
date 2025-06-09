 const appendCmd = [
    'common-comp-video',
    'common-base-art-player',
    'common-base-component-video-player-listener'
]

const sourcePaths = {
  'common-comp-video': 'packages/lib/mse-controller.js',
  'common-base-art-player': 'packages/lib/mse-controller.js',
  'common-base-component-video-player-listener': 'packages/lib/mse-controller.js'
};

const targetPaths = {
    'common-comp-video': 'packages/components/common-base-art-player/node_modules/mpegts.js/src/core/mse-controller.js',
    'common-base-art-player': 'packages/components/common-base-art-player/node_modules/mpegts.js/src/core/mse-controller.js',
    'common-base-component-video-player-listener': 'packages/components/common-base-art-player/node_modules/mpegts.js/src/core/mse-controller.js'
  };

module.exports = {
    appendCmd,
    targetPaths,
    sourcePaths
}


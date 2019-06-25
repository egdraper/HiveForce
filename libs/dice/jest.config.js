module.exports = {
  name: 'dice',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/dice',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

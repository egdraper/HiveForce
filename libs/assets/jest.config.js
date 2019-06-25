module.exports = {
  name: 'assets',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/assets',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

module.exports = {
  name: 'feit',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/feit',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

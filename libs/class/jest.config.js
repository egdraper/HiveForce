module.exports = {
  name: 'class',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/class',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

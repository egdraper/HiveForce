module.exports = {
  name: 'maps',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/maps',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

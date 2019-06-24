module.exports = {
  name: 'architype',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/architype',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

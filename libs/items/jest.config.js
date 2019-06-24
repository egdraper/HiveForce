module.exports = {
  name: 'items',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/items',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

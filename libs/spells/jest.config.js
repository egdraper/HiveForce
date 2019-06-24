module.exports = {
  name: 'spells',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/spells',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

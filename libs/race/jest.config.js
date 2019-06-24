module.exports = {
  name: 'race',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/race',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

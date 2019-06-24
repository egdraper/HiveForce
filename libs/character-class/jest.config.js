module.exports = {
  name: 'character-class',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/character-class',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

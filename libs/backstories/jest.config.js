module.exports = {
  name: 'backstories',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/backstories',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

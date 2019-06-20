module.exports = {
  name: 'hive-force',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/hive-force',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

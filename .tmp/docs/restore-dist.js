const fs = require('fs');
const cp = require('child_process');

const files = [
  'dist/schemas/Course.js',
  'dist/schemas/Course.js.map',
  'dist/src/courses/crud/createCourse.js',
  'dist/src/courses/crud/createCourse.js.map',
  'dist/src/courses/crud/deleteCourse.js',
  'dist/src/courses/crud/deleteCourse.js.map',
  'dist/src/payment/verify.js',
  'dist/src/payment/verify.js.map',
];

for (const file of files) {
  const committed = cp.execFileSync('git', ['show', `HEAD:${file}`]);
  fs.writeFileSync(file, committed);
}

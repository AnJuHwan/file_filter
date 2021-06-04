const path = require('path');
const os = require('os');
const fs = require('fs');

//  --- 계획 ---
// 1. 사용자가 원하는 폴더의 이름을 받아온다

// argv 명령어를 인자로 받아오기
const folder = process.argv[2];
// 디렉토리 경로 설정
const workingDir = path.join(
  os.homedir(),
  'Desktop',
  'Front-end',
  'Node',
  folder,
);

// 경로 잘못 설정 에러메세지
if (!folder || !fs.existsSync(workingDir)) {
  console.error('Please enter folder name in Pictures');
  return;
}
console.log(workingDir);

// 2. 그 폴더안에 video , captured , duplicated 폴더를 만든다.
const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

// console.log(videoDir);
// console.log(capturedDir);
// console.log(duplicatedDir);

// existsSync : 동기적방식 , fs.existsSync(path) , 경로가 있으면 true , 없으면 false 반환함
!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

// 3. 폴더안에 있는 파일들을 다 돌면서 해당하는 mp4|mov , png|aae, IMG_123 (IMG_E1234)
fs.promises
  .readdir(workingDir) //
  .then((files) => processFiles(files)) // .then(processFiles) 동일
  .catch(console.log);

//
function processFiles(files) {
  files.forEach((file) => {
    if (isVideoFile(file)) {
      move(file, videoDir);
    } else if (isCapturedFile(file)) {
      move(file, capturedDir);
    } else if (isDuplicatedFile(files, file)) {
      move(file, duplicatedDir);
    }
  });
}

// Video 파일 찾기
function isVideoFile(file) {
  // regExp 정규식
  // /
  const regExp = /(mp4|mov)$/gm;
  const match = file.match(regExp);
  //   console.log(match);
  return !!match; //!! match의 값이 있으면 true , null , undefined (없다면) false
}

// Captured 파일 찾기
function isCapturedFile(file) {
  // /패턴$/gm; $ : t$ -> t라는 문자가 맨 마지막에 있으면 이라는 뜻
  const regExp = /(png|aae)$/gm;
  const match = file.match(regExp);
  //   console.log(match);
  return !!match;
}

// Duplicated 파일 찾기
function isDuplicatedFile(files, file) {
  // startsWith('찾고싶은 문자',?option(몇번째 문자열부터 시작))
  // 시작이 IMG_XXXX -> IMG_EXXXX
  // 만약에 파일이 IMG_로 시작하지 않는 파일이거나 IMG_E 라면 false
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false;
  }
  // split('_') : _ 마다 잘라줌
  const edited = `IMG_E${file.split('_')[1]}`;
  const found = files.find((f) => f.includes(edited));
  return !!found;
}

// 파일 이동
function move(file, targetDir) {
  console.info(`move ${file} to ${path.basename(targetDir)}`);
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises
    .rename(oldPath, newPath) //
    .catch(console.error);
}

/*
  fs.promises
  .readdir(workingDir) //
  .then((file) => {
    file.forEach((file) => {});
  })
  .catch(console.log);
이렇게 해도 됨
*/

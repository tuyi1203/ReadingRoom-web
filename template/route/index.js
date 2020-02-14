/* eslint-disable */
const path = require('path');
const fs = require('fs');
const root = '../../src';
const relatively = 'display/modules';

module.exports = function (modulePath) {

  if (!modulePath) {
    console.log('没有输入路径');
    return;
  }

  modulePath = path.resolve(__dirname, root, relatively, modulePath);

  console.log('模块目录：' + modulePath);

  let tem;

  // 创建目录
  try {
    fs.mkdirSync(modulePath);
    console.log('目录创建成功');
  } catch (error) {
    console.log('目录创建失败');
  }

  //写文件
  writeTemplate(modulePath, 'route.jsx', process, 'route.jsx');

  function process(tem) {
    return tem;
  }
}

function writeTemplate(modulePath, tname, process, fileName = '') {
  try {
    tem = fs.readFileSync(path.resolve(__dirname, `${tname}.template`));
    fs.writeFileSync(path.resolve(modulePath, fileName ? fileName : tname), process(tem.toString()));
    console.log(`${tname}-----ok`);
  } catch (error) {
    console.log(`[${tname}]生成失败`, error);
  }
}

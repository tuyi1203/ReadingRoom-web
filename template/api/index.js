/* eslint-disable */
const path = require('path');
const fs = require('fs');
const root = '../../src';
const relatively = 'api/';

module.exports = function (name, modulePath) {

  if (!modulePath) {
    console.log('没有输入路径');
    return;
  }

  if (!name) {
    console.log('没有输入模块名称');
    return;
  }

  modulePath = path.resolve(__dirname, root, relatively, modulePath, name);

  console.log('模块目录：' + modulePath);

  let tem;

  // 创建目录
  try {
    fs.mkdirSync(modulePath);
    console.log('目录创建成功');
  } catch (error) {
    console.log('目录创建失败');
  }

  writeTemplate(modulePath, 'index.ts', process, name);
  writeTemplate(modulePath, 'IReq.ts', process, name);
  writeTemplate(modulePath, 'IResp.ts', process, name);

  function process(tem) {
    return tem.replace(/\{name\}/g, name);
  }
}

function writeTemplate(modulePath, tname, process) {
  try {
    tem = fs.readFileSync(path.resolve(__dirname, `${tname}.template`));
    fs.writeFileSync(path.resolve(modulePath, tname), process(tem.toString()));
    console.log(`${tname}-----ok`);
  } catch (error) {
    console.log(`[${tname}]生成失败`, error);
  }
}

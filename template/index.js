switch (process.argv[2]) {
  case 'm':
    require('./modules')(process.argv[3], process.argv[4]);
    break;
  case 'm-r':
    require('./modules-router')(process.argv[3], process.argv[4]);
    break;
  case 'a':
    require('./api')(process.argv[3], process.argv[4]);
    break;
  // case 'c':
  //   require('./component')(process.argv[3], process.argv[4]);
  //   break;
  // case 'r':
  //   require('./route')(process.argv[3]);
  //   break;
  default:
    console.log('参数错误')
    break;
}

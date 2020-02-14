import getList from './getList';
import add from './add';
import edit from './edit';
import del from './del';

import addCity from './addCity';
import addFloor from './addFloor';
import addNation from './addNation';
import addRoom from './addRoom';
import delCity from './delCity';
import delFloor from './delFloor';
import delNation from './delNation';
import delRoom from './delRoom';
import editCity from './editCity';
import editFloor from './editFloor';
import editNation from './editNation';
import editRoom from './editRoom';
import getCityList from './getCityList';
import getCityPageList from './getCityPageList';
import getFloorList from './getFloorList';
import getFloorPageList from './getFloorPageList';
import getNationList from './getNationList';
import getNationPageList from './getNationPageList';
import getRoomList from './getRoomList';
import getRoomPageList from './getRoomPageList';
export default {
  getList,
  add,
  del,
  edit,
  addCity,
  addFloor,
  addNation,
  addRoom,
  delCity,
  delFloor,
  delNation,
  delRoom,
  editCity,
  editFloor,
  editNation,
  editRoom,
  getCityList, // 获取城市列表
  getCityPageList, // 获取城市分页列表
  getFloorList, // 获取楼层列表
  getFloorPageList, // 获取楼层分页列表
  getNationList, // 获取国家列表
  getNationPageList, // 获取国家分页列表
  getRoomList, // 获取机房列表
  getRoomPageList // 获取机房分页列表
};
import getList from './getList';
import getProtocolSupport from './getProtocolSupport';
import addProtocolSupport from './addProtocolSupport';
import editProtocolSupport from './editProtocolSupport';
import delProtocolSupport from './delProtocolSupport';
import add from './add';
import edit from './edit';
import del from './del';
import deviceConn from './deviceConn';

import addOs from './addOs';
import addVendor from './addVendor';
import addVersion from './addVersion';
import delOs from './delOs';
import delVendor from './delVendor';
import delVersion from './delVersion';
import editOs from './editOs';
import editVendor from './editVendor';
import editVersion from './editVersion';
import getOsList from './getOsList';
import getOsPageList from './getOsPageList';
import getVendorList from './getVendorList';
import getVendorPageList from './getVendorPageList';
import getVersionList from './getVersionList';
import getVersionPageList from './getVersionPageList';

export default {
  getList,
  getProtocolSupport,
  addProtocolSupport,
  editProtocolSupport,
  delProtocolSupport,
  add,
  edit,
  del,
  deviceConn,
  addOs,
  addVendor,
  addVersion,
  delOs,
  delVendor,
  delVersion,
  editOs,
  editVendor,
  editVersion,
  getOsList, // 获取OS列表
  getOsPageList, // 获取OS分页列表
  getVendorList, // 获取厂商列表
  getVendorPageList, // 获取厂商分页列表
  getVersionList, // 获取版本号列表
  getVersionPageList // 获取版本号分页列表
};
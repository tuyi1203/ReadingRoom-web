enum Urls {
  login = '/login', // 登录api地址
  qrLogin = '/qrlogin', // 微信扫码登陆
  getVerifyCode = '/getverifycode', // 取得短信验证码
  bindLogin = '/bindlogin', // 微信绑定登陆
  getLoginQRCode = '/wechat/getloginqrcode', // 取得微信登陆二维码

  basicLogin = '/login/basic', // 基础登录地址
  getRoleListUnLogin = '/login/roles', // 不需要token读取角色列表

  // ----------角色管理接口------------
  getRoleList = '/roles', // 取得角色列表
  delRole = '/roles/{id}', // 删除角色
  addRole = '/roles', // 添加角色
  editRole = '/roles/{id}', // 修改角色
  getPermissionList = '/permissions', // 取得所有权限列表
  getPermissionsByRid = '/permissions/rid/{id}', // 取得角色拥有的所有权限列表
  editPermissionsByRid = '/permissions/rid/{id}', // 修改角色拥有的所有权限

  // -----------用户管理接口------------
  getUserList = '/users', // 获取用户列表
  delUser = '/users/{id}', // 删除单个用户
  editUser = '/users/{id}', // 编辑用户数据
  addUser = '/users', // 添加用户数据
  getUserDetail = '/users/{id}', // 获取单个用户数据

  // -----------职称填报接口------------
  getBaseInfoDetail = '/progress/baseinfo/detail/', // 获取基本信息
  addOrEditBaseInfo = '/progress/baseinfo/edit/', // 添加或修改基本信息
  getMoralDetail = '/progress/morals/detail/', // 获取师德师风信息
  addOrEditMoral = '/progress/morals/edit/', // 添加或修改基本信息
  getQualificationEducationDetail = '/progress/qualification/educate/detail/', // 获取基本资格教育信息
  addOrEditQualificationEducation = '/progress/qualification/educate/edit/', // 添加或修改基本资格教育信息
  getQualificationWorkDetail = '/progress/qualification/work/detail/', // 获取基本资格工作信息
  addOrEditQualificationWork = '/progress/qualification/work/edit/', // 添加或修改基本资格工作信息
  getQualificationWorkExperienceDetail = '/progress/qualification/work/experience/detail/', // 获取基本资格教育信息
  addOrEditQualificationWorkExperience = '/progress/qualification/work/experience/edit/', // 添加或修改基本资格教育信息
  getQualificationManageExperienceDetail = '/progress/qualification/manage/experience/detail/', // 获取基本资格教育信息
  addOrEditQualificationManageExperience = '/progress/qualification/manage/experience/edit/', // 添加或修改基本资格教育信息
  addResearchAchievement = '/progress/research/achievement', // 添加研究成果数据
  editResearchAchievement = '/progress/research/achievement/{id}', // 修改研究成果数据
  getResearchAchievementList = '/progress/research/achievement/', // 获取研究成果列表
  getResearchAchievementDetail = '/progress/research/achievement/{id}', // 获取研究成果详情
  delResearchAchievement = '/progress/research/achievement/{id}', // 删除研究成果数据
  addTeachAchievement = '/progress/teach/achievement', // 添加教育成果数据
  editTeachAchievement = '/progress/teach/achievement/{id}', // 修改教育成果数据
  getTeachAchievementList = '/progress/teach/achievement/', // 获取教育成果列表
  getTeachAchievementDetail = '/progress/teach/achievement/{id}', // 获取教育成果详情
  delTeachAchievement = '/progress/teach/achievement/{id}', // 删除教育成果数据
  getDictList = '/progress/dict/', // 获取数据字典列表

  addFile = '/files/', // 上传文件
  delFile = '/files/{id}/', // 删除文件
  getFileList = '/files/', // 获取文件列表
  getFileListByIds = '/files/ids', // 获取文件列表
  downloadFile = '/files/download/{id}/', // 下载文件

  register = '/login/register', // 注册
  getDomainListUnLogin = '/login/domains',  // 不需要token读取组织列表
  getNetElement = '/infra/datadict/netelement', // 获取网元数据列表
  addNetElement = '/infra/datadict/netelement/', // 添加网元数据
  editNetElemnt = '/infra/datadict/netelement/{id}/', // 编辑网元数据
  delNetElemnt = '/infra/datadict/netelement/{id}/', // 删除网元数据
  deviceConn = '/infra/netelementmanager/netelement/device_conn/', // 网元连接测试

  getUserManagerDomainList = '/usermanager/domains/', // 获取用户组织列表
  addUserManagerDomain = '/usermanager/domains/', // 新建组织
  editUserManagerDomain = '/usermanager/domains/{id}/', // 修改组织
  delUesrManagerDomain = '/usermanager/domains/{id}/', // 修改组织
  getDomainDetail = '/usermanager/domains/{id}/', // 获得组织详情
  getUserManagerGroupList = '/usermanager/groups/', // 获取工作空间列表
  addUserManagerGroup = '/usermanager/groups/', // 新建工作空间
  editUserManagerGroup = '/usermanager/groups/{id}/', // 修改工作空间数据
  delUserManagerGroup = '/usermanager/groups/{id}/', // 删除工作空间数据
  getGroupDetail = '/usermanager/groups/{id}/', // 获取工作空间详情
  getProtocolSupport = '/infra/datadict/protocolsupport/', // 获取支持协议
  addProtocolSupport = '/infra/datadict/protocolsupport/', // 添加支持协议
  editProtocolSupport = '/infra/datadict/protocolsupport/{id}/', // 修改支持协议
  delProtocolSupport = '/infra/datadict/protocolsupport/{id}/', // 删除支持协议
  getNetElementCustom = '/infra/datadict/netelementcustom/', // 获取网元自定义字典列表
  addNetElementCustom = '/infra/datadict/netelementcustom/', // 新增网元自定义字典
  editNetElementCustom = '/infra/datadict/netelementcustom/{id}/', // 编辑网元自定义字典
  delNetElementCustom = '/infra/datadict/netelementcustom/{id}/', // 删除网元自定义字典
  getDataCenterList = '/infra/datacenter/', // 获取数据中心字典列表
  addDataCenter = '/infra/datacenter/', // 添加数据中心字典
  editDataCenter = '/infra/datacenter/{id}/', // 修改数据中心字典数据
  delDataCenter = '/infra/datacenter/{id}/', // 删除单个数据中心字典数据
  getDataCenter = '/infra/datacenter/{id}/', // 获取单个数据中心字典数据
  getNetElementUserManagerList = '/infra/netelementmanager/netelementusermanager/', // 获取网元用户库列表
  addNetElementUserManager = '/infra/netelementmanager/netelementusermanager/', // 添加网元用户库数据
  editNetElementUserManager = '/infra/netelementmanager/netelementusermanager/{id}/', // 修改网元用户库数据
  delNetElementUserManager = '/infra/netelementmanager/netelementusermanager/{id}/', // 删除单个网元用户数据
  delNetElementUsersManager = '/infra/netelementmanager/netelementusermanager/{ids}/', // 删除多条网元用户数据
  getNetElementManagerList = '/infra/netelementmanager/netelement/', // 获取网元库列表
  addNetElementManager = '/infra/netelementmanager/netelement/', // 添加网元数据
  editNetElementManager = '/infra/netelementmanager/netelement/{id}/', // 修改网元数据
  delNetElementManager = '/infra/netelementmanager/netelement/{id}/', // 删除单个网元数据
  delNetElementsManager = '/infra/netelementmanager/netelement/{ids}/', // 删除多条网元数据
  getYangsList = '/orchestration/yangs', // 获取编排模型
  addYang = '/orchestration/yangs/', // 新增编排模型
  editYang = '/orchestration/yangs/{id}/', // 修改编排模型
  delYang = '/orchestration/yangs/{id}/', // 删除编排模型
  getYangDetail = '/orchestration/yangs/{id}/', // 获取单条编排数据
  getHeatbeatGroupList = '/orchestration/heatbeatgroups/', // 获取冗余心跳列表
  addHeatbeatGroup = '/orchestration/heatbeatgroups/', // 新建冗余心跳数据
  editHeatbeatGroup = '/orchestration/heatbeatgroups/{id}/', // 修改冗余心跳数据
  delHeatbeatGroup = '/orchestration/heatbeatgroups/{id}/', // 删除冗余心跳数据
  getMethodList = '/orchestration/heatbeatgroups/method', // 获取冗余心跳测试方法列表
  getInfoList = '/orchestration/infos/', // 获取编排器信息列表
  addInfo = '/orchestration/infos/', // 新建编排器信息
  editInfo = '/orchestration/infos/{id}/', // 修改编排器信息
  delInfo = '/orchestration/infos/{id}/', // 删除编排器信息
  getInfoRole = '/orchestration/infos/role/', // 读取编排器角色信息
  getInfoVersion = '/orchestration/infos/version/', // 获取编排器版本信息
  getInfoTypes = '/orchestration/infos/type/', // 获取编排器类型信息
  getLinemanagerList = '/ispmanager/linemanager/', // 取得ISP运行商列表
  addLinemanager = '/ispmanager/linemanager/', // 新建运营商
  editLinemanager = '/ispmanager/linemanager/{id}/', // 修改运营商信息
  delLineManager = '/ispmanager/linemanager/{id}/', // 删除运营商信息

  // ----------互联网IP资源池------------
  getSegmentipsList = '/ipmanager/segmentips/', // 获取IPV4资源池列表
  getChildSegmentipsList = '/ipmanager/segmentips/{child_ID}/child/', // 获取IPV4资源池列表child
  getIpmanagerSegmentipsIptype = '/ipmanager/segmentips/iptype/', // 获取ip类型
  getIpmanagerSegmentipsBroadcast = '/ipmanager/segmentips/broadcast/', // 广播类型
  getAllDatadictNetelement = '/infra/netelementmanager/netelement/', // 获取所有网关设备
  deleteIpSement = '/ipmanager/segmentips/{id}/', // 删除
  postIpsSplit = '/ipmanager/ips/split/', // 生成1
  postIpsSplit2 = '/ipmanager/segmentips/validate/', // 生成2
  getIpmanageContracts = '/ipmanager/contracts/', // 获取合同编号
  postAddIp = '/ipmanager/ips/', // 新建
  getContractType = '/ipmanager/contracts/type/', // 获取IP资源类型
  getContractUnit = '/ipmanager/contracts/unit/', // 获取货币单位
  postIPmanageAttaches = '/ipmanager/attaches/', // 上传图片后新建
  deleteAttachesByUUUID = '/ipmanager/attaches/uuid/', // 删除上传的文件 单个
  putHt = '/ipmanager/contracts/id/', // 编辑合同
  getResourceType = '/ipmanager/segmentips/resource/', // 获取资源类型
  getIpmanagerAdd = '/ipmanager/segmentips/{id}/add/', // 补全

  getAddr = '/ispmanager/linemanager/parse_net_element_address/', // 获取端口地址
  getContractList = '/ispmanager/contractmanager/', // 获取合同列表
  addContract = '/ispmanager/contractmanager/', // 新建合同
  editContract = '/ispmanager/contractmanager/{id}/', // 修改合同
  delContract = '/ispmanager/contractmanager/{id}/', // 删除合同
  editRenew = '/ispmanager/contractmanager/{id}/renew_contract/', // 续约合同
  getModules = '/usermanager/modules/', // 获取登录用户已有权限
  addContractAttach = '/ispmanager/contractfilemanager/', // 新建合同附件
  fileUpload = '/filemanager/files/', // 上传文件
  delAttach = '/ispmanager/contractfilemanager/{uuid}/', // 删除单个附件
  getAttachList = '/ispmanager/contractfilemanager/', // 获取合同附件列表
  editAuthDomain = '/usermanager/auth/domains/{id}', // 提交权限domain变更
  editAuthGroup = '/usermanager/auth/groups/{id}', // 提交权限group变更

  getShortcutMenuList = '/menu', // 获取快捷菜单列表
  delShortcutMenu = '/menu/{id}', // 删除快捷菜单
  addEditShortcutMenu = '/menu', // 创建/更新快捷菜单

  /** 数据字典、数据中心字典新加接口 */
  getVendorList = '/infra/datadict/netelement/vendor/', // 获取vendor列表
  addVendor = '/infra/datadict/netelement/vendor/', // 添加vendor
  editVendor = '/infra/datadict/netelement/vendor/{id}/', // 编辑vendor
  delVendor = '/infra/datadict/netelement/vendor/{id}/', // 删除vendor

  getOsList = '/infra/datadict/netelement/os/',
  addOs = '/infra/datadict/netelement/os/',
  editOs = '/infra/datadict/netelement/os/{id}/',
  delOs = '/infra/datadict/netelement/os/{id}/',

  getVersionList = '/infra/datadict/netelement/version/',
  addVersion = '/infra/datadict/netelement/version/',
  editVersion = '/infra/datadict/netelement/version/{id}/',
  delVersion = '/infra/datadict/netelement/version/{id}/',

  getNationList = '/infra/datacenter/nation/',
  addNation = '/infra/datacenter/nation/',
  editNation = '/infra/datacenter/nation/{id}/',
  delNation = '/infra/datacenter/nation/{id}/',

  getCityList = '/infra/datacenter/city/',
  addCity = '/infra/datacenter/city/',
  editCity = '/infra/datacenter/city/{id}/',
  delCity = '/infra/datacenter/city/{id}/',

  getRoomList = '/infra/datacenter/room/',
  addRoom = '/infra/datacenter/room/',
  editRoom = '/infra/datacenter/room/{id}/',
  delRoom = '/infra/datacenter/room/{id}/',

  getFloorList = '/infra/datacenter/floor/',
  addFloor = '/infra/datacenter/floor/',
  editFloor = '/infra/datacenter/floor/{id}/',
  delFloor = '/infra/datacenter/floor/{id}/',
}

export default Urls;
/** 
 * 入参数据数据接口
 */
export default interface IReq {
  local_addr: string;
  conn_type_id: number;
  line_num: string;
  isp_line_num: string;
  asn: number;
  route_ingredient: string;
  contract_id: number;
  logic_ap_id: number;
  phyical_ap_id: number;
  product_type: string;
  logic_ap_phyical_port: string;
  phyical_ap_phyical_port: string;
  logic_ap_port_rate: number;
  phyical_ap_port_rate: number;
  opposite_name: string;
  remote_addr: string;
  blackholes_type_id: number;
  blackholes_community: string;
  committed_bw: number;
  burst_bw: number;
  routes_num_type_id: number;
  prefixes_num: number;
  blackholes_num: number;
  owner: {};
}
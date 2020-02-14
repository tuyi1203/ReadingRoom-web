/** 
 * 出参数据数据接口
 */
export default interface IResp {
  count: number;
  data: {
    id: number,
    conn_type_id: number,
    opposite_name: string,
    line_numb: string,
    isp_line_num: string,
    asn: number,
    route_ingredient: string,
    product_type: string,
    contract: {
      id: 1,
      contract_num: string
    }
    logic_ap_id: number,
    phyical_ap_id: number,
    logic_ap_phyical_port: string,
    phyical_ap_phyical_port: string,
    local_addr: string,
    remote_addr: string,
    blackholes_type_id: number,
    blackholes_community: string,
    routes_num_type_id: number,
    prefixes_num: number,
    blackholes_num: number,
    committed_bw: number,
    burst_bw: number,
    owner: any,
    conn_type: number,
    blackholes_type: number,
    routes_num_type: number,
    logic_ap_port_rate: number,
    phyical_ap_port_rate: number,
    creator: any,
  }[];
}
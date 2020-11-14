import * as React from 'react';
import { Drawer, Divider, Col, Row, List, Typography, Icon, Button, message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { progress, files } from 'src/api';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  type: string;
  yesOrNoOptions: any;
  findLabel: any;
  getOption: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  detailData: any;
}

/**
 * TeachDetailDrawer
 */
class TeachDetailDrawer extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      detailData: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getDetail();
  }

  /**
   * 获取详情
   */
  getDetail = async () => {
    let params: any = {
    };

    const res = await progress.getTeacherTeachDetail(params,
      this.props.drawerData.id);
    if (res.code) {
      message.error(res.msg);
      return;
    }
    if (res) {
      this.setState({
        detailData: res.results.data,
      });
    }
  }

  render() {
    const {
      onClose,
      type,
      // yesOrNoOptions,
      findLabel,
      getOption,
    } = this.props;

    const {
      detailData,
    } = this.state;
    // console.log(this.props.visible);
    // const pStyle = {
    //   fontSize: 16,
    //   color: 'rgba(0,0,0,0.85)',
    //   lineHeight: '24px',
    //   display: 'block',
    //   marginBottom: 16,
    // };

    const DescriptionItem = (props: any) => (
      <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
      >
        <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
        />
        {props.value}
      </div>
    );

    /**
     * 文件下载
     */
    const download = async (id: number, fileType: string, fileName: string) => {
      // console.log(id);
      const res = await files.download(id, {});

      const file = new Blob([res.data], {
        type: fileType
      });
      console.log(res);
      const a = document.createElement('a');
      a.download = fileName;
      a.href = URL.createObjectURL(file);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return (
      <Drawer
        width={1000}
        placement="right"
        closable={true}
        onClose={onClose}
        visible={this.props.visible}
      >
        <Divider orientation="left">成果信息</Divider>
        <Row style={{ marginBottom: 12 }}>
          <Col span={6}>
            <DescriptionItem value="成果类型" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={detailData && detailData.achievement_type && findLabel(getOption('achievement_type'), detailData.achievement_type)}
            />
          </Col>
        </Row>
        {type === '1' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="获奖时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_date && moment(detailData.award_date).format('YYYY-MM')}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={12}>
                <DescriptionItem value="表彰主体(本人、本人所带班队、本人所带学生)" />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  value={detailData && detailData.award_main}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="表彰奖励内容" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_title}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="获奖类别" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_type && findLabel(getOption('award_type'), detailData.award_type)}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="获奖级别" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_level && findLabel(getOption('award_level'), detailData.award_level)}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="获奖等次" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_position && findLabel(getOption('award_position'), detailData.award_position)}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人作用" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_role}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="授奖单位" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_authoriry_organization}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="授奖国家(地区）" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.award_authoriry_country}
                />
              </Col>
            </Row>
          </span>
        }
        {type === '2' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="交流管理经验时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.manage_exp_communicate_date && moment(detailData.manage_exp_communicate_date).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="交流管理经验内容" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.manage_exp_communicate_content}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人作用" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.manage_exp_communicate_role}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="交流范围" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.manage_exp_communicate_range}
                />
              </Col>
            </Row>
          </span>
        }
        {type === '3' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="指导开始时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.teacher_guide_date_start && moment(detailData.teacher_guide_date_start).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="指导结束时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData &&  detailData.teacher_guide_date_end && moment(detailData.teacher_guide_date_end).format('YYYY-MM')}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="指导对象姓名" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.teacher_guide_name}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="指导内容" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.teacher_guide_content}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="指导效果及荣誉和备注" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.teacher_guide_effect}
                />
              </Col>
            </Row>
          </span>
        }
        <Divider orientation="left">印证材料</Divider>
        {
          detailData
          && detailData.files.length > 0
          &&
          <List
            bordered={true}
            dataSource={detailData.files}
            renderItem={(item: any) => (
              <List.Item>
                <Typography.Text>
                  <Icon type="paper-clip" />
                </Typography.Text>
                <Button type="link" onClick={download.bind(this, item.id, item.file_type, item.original_name)}>{item.original_name}</Button>
                <span style={{ marginLeft: 30 }}>上传日期：{moment(item.created_at).format('YYYY/MM/DD')}</span>
              </List.Item>
            )}
          />
        }
      </Drawer>
    );
  }
}

export default TeachDetailDrawer;

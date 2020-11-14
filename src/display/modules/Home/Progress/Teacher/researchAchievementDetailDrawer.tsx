import * as React from 'react';
import { Drawer, Divider, Col, Row, List, Typography, Icon, Button, message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { files, progress } from 'src/api';
// import CommonUtils from 'src/utils/commonUtils';

/** Props接口，定义需要用到的Porps类型 */
export interface IProps {
  // form: any;
  findLabel: any;
  drawerData: any;
  onClose: any;
  visible: boolean;
  type: string;
  yesOrNoOptions: any;
  getOption: any;
}

/** State接口，定义需要用到的State类型，constructor中的state应该和此定义的类型一致 */
export interface IState {
  detailData: any;
}

/**
 * ResearchAchievementDetailDrawer
 */
class ResearchAchievementDetailDrawer extends React.PureComponent<IProps, IState> {
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

    const res = await progress.getTeacherResearchDetail(params,
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
      // drawerData,
      onClose,
      type,
      yesOrNoOptions,
      getOption,
    } = this.props;
    // console.log(this.props.visible);
    // const pStyle = {
    //   fontSize: 16,
    //   color: 'rgba(0,0,0,0.85)',
    //   lineHeight: '24px',
    //   display: 'block',
    //   marginBottom: 16,
    // };

    const { detailData } = this.state;

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
            <DescriptionItem value="科学领域" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={detailData && detailData.course && _.find(getOption('course'), ['value', detailData.course.toString()])?.label}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem value="成果类型" />
          </Col>
          <Col span={6}>
            <DescriptionItem
              value={detailData && detailData.achievement_type && _.find(getOption('achievement_type'), ['value', detailData.achievement_type.toString()])?.label}
            />
          </Col>
        </Row>
        {type === '1' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="论文名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_title}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="发表刊物名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_book_title}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="刊号" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_book_kanhao}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="卷号" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_book_juanhao}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="发表年月" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_date && moment(detailData.paper_date).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="是否核心刊物" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_core_book && yesOrNoOptions(detailData.paper_core_book)}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="起始页码" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_start_page}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="结束页码" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_end_page}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="起始页码" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_start_page}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="结束页码" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_end_page}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人作用" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_role && _.find(getOption('paper_role'), ['value', detailData.paper_role.toString()])?.label}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="作者人数" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_author_num}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人排名" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_author_rank}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="本人撰写字数" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_author_count}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人撰写章节" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.paper_author_section}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <DescriptionItem value="论文收录情况" />
              </Col>
              <Col span={6}>
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  <DescriptionItem value={detailData && detailData.paper_quote} />
                </span>
              </Col>
            </Row>
          </span>
        }
        {type === '2' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_title}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题批准号" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_no}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题类别" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_type && _.find(getOption('subject_type'), ['value', detailData.subject_type.toString()])?.label}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题等级" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_level && _.find(getOption('subject_level'), ['value', detailData.subject_level.toString()])?.label}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题负责人" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_responseable_man}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题中本人角色" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_role}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题本人排名" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_self_rank}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题经费" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_cost}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题状态" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_status && _.find(getOption('subject_status'), ['value', detailData.subject_status.toString()])?.label}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题承担单位" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_exec}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={12}>
                <DescriptionItem value="课题委托单位" />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  value={detailData && detailData.subject_delegate}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="课题开始年月" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_start_date && moment(detailData.subject_start_date).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="课题结束年月" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.subject_end_date && moment(detailData.subject_end_date).format('YYYY-MM')}
                />
              </Col>
            </Row>
          </span>
        }
        {type === '3' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="著作名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_title}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="著作类别" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_type}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="出版社名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_publish_company_name}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="出版号" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_publish_no}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="出版日期" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_publish_date && moment(detailData.book_publish_date).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="著作中本人角色" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_role}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="总字数" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_write_count}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="作者人数" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_author_num}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="本人撰写字数" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_author_write_count}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="本人排名" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.book_author_rank}
                />
              </Col>
            </Row>
          </span>
        }
        {type === '4' &&
          <span>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="专利或软件著作权类型" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.copyright_type}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="专利或软件著作权名称" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.copyright_title}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={6}>
                <DescriptionItem value="审批时间" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.copyright_ratification && moment(detailData.copyright_ratification).format('YYYY-MM')}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem value="本人角色" />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  value={detailData && detailData.copyright_role}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={12}>
                <DescriptionItem value="专利号（登记号）" />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  value={detailData && detailData.copyright_no}
                />
              </Col>
            </Row>
          </span>
        }
        <Divider orientation="left">印证材料</Divider>
        {
          detailData
          && detailData.achievement_files
          && detailData.achievement_files.length > 0
          &&
          <List
            bordered={true}
            dataSource={detailData.achievement_files}
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

export default ResearchAchievementDetailDrawer;

import React, { Component, Fragment } from 'react';
import { Modal, Upload, Icon, Row, Col, message, Progress } from 'antd';
import axios from 'axios';
import prompt from '@/components/Prompt';
import { checkSuffix } from '@/utils/common';
import styles from './index.less';
import { thisExpression } from '@babel/types';

export default class AdUpload extends Component {
  static defaultProps = {
    urlType: 'ems',
    mode: 'swiper',
    fileLength: 5,
    showUpload: true,
  };

  constructor(props) {
    super(props);
    const { urlType, actionNameUrl, readNameUrl } = props;
    this.state = {
      visible: false,
      previewImage: '',
      fileList: [],
    };
    this.token = localStorage.getItem('token');
    this.actionName = actionNameUrl ? `/server/api/${actionNameUrl}` : `/server/api/attachment/uploadFile`;
    this.readName = readNameUrl ? `/server/api/${readNameUrl}` : `/server/api/${urlType}/attachment/viewpage`;
  }

  componentDidMount() {
    const { value } = this.props;
    if (value && value.length > 0) {
      this.setFileList(value);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value && value.length > 0) {
      this.setFileList(value);
    } else {
      this.setState({ fileList: [] });
    }
  }

  setFileList = value => {
    const actionName = this.actionName;
    const readName = this.readName;
    const fileList = value.map(file => {
      if (file.uid) {
        return file;
      }
      const { id, fileToken, fileName, fileType } = file;
      let data = {
        uid: id,
        status: 'done',
        url: '',
        id,
        name: fileName,
        type: fileType,
        fileToken,
      };
      // `http://${window.location.host}${readName}?token=${this.token}&fileToken=${fileToken}`
      return data;
    });
    this.setState({ fileList });
  };

  handleCancel = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  handlePreview = file => {
    const { mode, value, handlePreview } = this.props;
    if (file.response) {
      prompt({
        type: 'warn',
        title: '????????????',
        content: '???????????????????????????????????????????????????,???????????????',
      });
      return;
    }
    if (mode === 'swiper') {
      if (handlePreview) handlePreview(value, value.findIndex(v => v.id === file.id));
    }
    // this.setState({
    //   previewImage: file.url || file.thumbUrl,
    //   previewVisible: true,
    // });
  };

  handleChange = ({ fileList }) => {
    const { callback } = this.props;
    if (callback) callback(true)
    fileList.map(file => {
      if (file.size && !file.response) {
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file.originFileObj);
        });
        axios
          .post(this.actionName, formData, {
            headers: {
              token: this.token,
            },
            onUploadProgress: ({ total, loaded }) => {
              const percent = Number(Math.round((loaded / total) * 100).toFixed(0));
              file.percent = percent;
              const newFileList = [
                ...this.state.fileList.filter(oldFile => oldFile.uid !== file.uid),
                file,
              ];
              this.setState({
                fileList: newFileList,
              });
              this.triggerChange(newFileList);
            },
          })
          .then(({ data: response }) => {
            const { code, message } = response;
            let newFileList = [];
            if (code === 0) {
              file.response = response;
              newFileList = [
                ...this.state.fileList.filter(oldFile => oldFile.uid !== file.uid),
                file,
              ];
            } else {
              newFileList = this.state.fileList.filter(oldFile => oldFile.uid !== file.uid);
              prompt({ type: 'error', title: '????????????', content: message });
            }
            this.setState({
              fileList: newFileList,
            });
            this.triggerChange(newFileList);
            if (callback) callback(false)
          })
          .catch(() => {
            const newFileList = this.state.fileList.filter(oldFile => oldFile.uid !== file.uid);
            this.setState({
              fileList: newFileList,
            });
            this.triggerChange(newFileList);
            prompt({ type: 'error', title: '????????????', content: '???????????????' });
            if (callback) callback(false)
          });
      }
    });

    // if (fileList.length === 0) {
    //   this.triggerChange([]);
    // }
    // fileList.filter(file => {
    //   if (!file.response) {
    //     this.triggerChange(fileList);
    //     return;
    //   }
    //   const { code, message } = file.response;
    //   if (code === 0) {
    //     this.triggerChange(fileList);
    //     return file;
    //   } else {
    //     const newFileList = fileList.filter(oldFile => oldFile.uid !== file.uid);
    //     this.setState({ fileList: newFileList });
    //     this.triggerChange(newFileList);
    //     prompt({ type: 'error', title: '????????????', content: message });
    //   }
    // });
  };

  remove = (e, uid) => {
    e.stopPropagation();
    const { fileList } = this.state;
    const newFileList = fileList.filter(file => file.uid !== uid);
    this.setState({ fileList: newFileList });
    this.triggerChange(newFileList);
  };

  triggerChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  isImage = name => {
    const arr = ['.jpg', '.jpeg', '.png', '.gif'];
    name = name.substring(name.lastIndexOf('.'), name.length) || '.jpg';
    return arr.includes(name.toLowerCase());
  };

  render() {
    const { visible, previewImage, fileList } = this.state;
    const { fileLength, showUpload, onChange, ...rest } = this.props;
    const actionName = this.actionName;
    const UploadButton = (
      <div>
        <Icon type="plus" />
        ??????
      </div>
    );
    return (
      <Fragment>
        <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
          <img alt="image" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Row type="flex" className={styles.upload}>
          <Col>
            <Row type="flex" style={{ width: '100%' }}>
              {fileList.map(file => (
                <Col
                  key={file.uid}
                  className={styles['upload-file']}
                  onClick={() => {
                    this.handlePreview(file);
                  }}
                >
                  <Icon
                    type={this.isImage(file.name) ? 'picture' : 'file'}
                    className={styles['upload-file-icon']}
                  />
                  <div title={file.name} className={styles['upload-file-name']}>
                    {file.name}
                  </div>
                  {file.percent && file.percent !== 100 && (
                    <Progress percent={file.percent} showInfo={false} size="small" />
                  )}
                  {showUpload && !this.props.disabled && (
                    <div
                      className={styles['upload-file-close']}
                      onClick={e => {
                        this.remove(e, file.uid);
                      }}
                    >
                      <Icon type="close" />
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </Col>
          <Col>
            <Upload
              // action={actionName}
              // headers={{ token: this.token }}
              listType="picture-card"
              fileList={[]}
              onChange={this.handleChange}
              beforeUpload={() => {
                return false;
              }}
              {...rest}
            >
              {fileList.length >= fileLength ? null : showUpload && UploadButton}
            </Upload>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

import { Table, Row, Col, Icon, Button, Modal } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Form } from 'antd';
import AdModal from '@/components/AdModal';
import AdButton from '@/components/AdButton';
import update from 'immutability-helper';
import styles from './index.less';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import { Fragment } from 'react';
import { connect } from 'dva';
import { transferLanguage } from '@/utils/utils'

const confirm = Modal.confirm;
let dragingIndex = -1;
@connect(({ i18n }) => ({
  language: i18n.language,
}))
class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    let className = restProps.className;
    let style = { ...restProps.style };
    if (
      !restProps.children[0].props.record.disabled ||
      !restProps.children[1].props.record.disabled
    ) {
      style = { ...style, cursor: 'move' };
      if (isOver) {
        if (restProps.index > dragingIndex) {
          className += ' drop-over-downward';
        }
        if (restProps.index < dragingIndex) {
          className += ' drop-over-upward';
        }
      }
      return connectDragSource(
        connectDropTarget(<tr {...restProps} className={className} style={style} />)
      );
    } else {
      return <tr {...restProps} className={className} style={style} />;
    }
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow)
);

@Form.create()
class DragSortingTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.disabledSelectedRows(props.dataSource) || [],
      selectedKeys: props.dataSource.filter(v => !v.hidden).map(item => item.dataIndex) || [],
      display: '',
    };
  }

  columns = [
    {
      title:transferLanguage('base.condition.tableColumns', this.props.language) ,
      dataIndex: 'title',
      width: 200,
      render: (text, record) => {
        return (
          <span>
            {text}
            {this.state.display === record.dataIndex && (
              <Icon style={{ marginLeft: 8 }} type="drag" />
            )}
          </span>
        );
      },
    },
  ];

  disabledSelectedRows = data =>
    data.map(item => {
      return item.fixed ? { disabled: true, ...item } : item;
    });

  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps;
    if (JSON.stringify(dataSource) !== JSON.stringify(this.props.dataSource)) {
      this.setState({
        data: this.disabledSelectedRows(dataSource),
        selectedKeys: dataSource.filter(v => !v.hidden).map(item => item.dataIndex),
      });
    }
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
    );
  };

  handleOk = () => {
    const { form, handleOk, isMobile, code } = this.props;
    const { data, selectedKeys } = this.state;
    const loginName = JSON.parse(localStorage.getItem('user')).loginName;
    form.validateFieldsAndScroll((errs, values) => {
      if (errs) return;
      const { freezingColumn } = values;
      const newColumns = data.map(item => {
        if (selectedKeys.includes(item.dataIndex)) {
          return { hidden: false, dataIndex: item.dataIndex };
        } else {
          return { hidden: true, dataIndex: item.dataIndex };
        }
      });
      localStorage.setItem(`${code}_${loginName}_column`, JSON.stringify(newColumns));
      localStorage.setItem(`${code}_${loginName}_freezingColumn`, JSON.stringify(freezingColumn));
      handleOk(newColumns, freezingColumn);
      this.props.setVisible();
    });
  };

  handleCancel = () => {
    this.props.setVisible();
  };

  reNewSetting = () => {
    const { oldDataSource, setVisible } = this.props;
    confirm({
      title: transferLanguage('base.prompt.restoreDefaultTip', this.props.language),
      content: '',
      okText: transferLanguage('base.prompt.confrim', this.props.language),
      okType: 'warn',
      cancelText: transferLanguage('base.prompt.cancel', this.props.language),
      onOk: () => {
        this.setState(
          {
            data: this.disabledSelectedRows(oldDataSource),
            selectedKeys: oldDataSource.filter(v => !v.hidden).map(item => item.dataIndex),
          },
          () => {
            this.handleOk();
          }
        );
      },
      onCancel() { },
    });
  };

  AdModalHeader = () => (
    <Row justify="space-between" type="flex" align="bottom">
      <Col>
        <h3>
          {transferLanguage('base.condition.setColumn', this.props.language)}
          {/* <span style={{ color: '#999', fontSize: 14 }}>???????????????????????????????????????????????????</span> */}
        </h3>
      </Col>
      <Col style={{ marginRight: 50, marginBottom: 5 }}>
        <Button.Group>
          <AdButton text={transferLanguage('base.condition.restoreDefault', this.props.language)}
            onClick={this.reNewSetting} />
          <AdButton type="primary" text={transferLanguage('base.prompt.save', this.props.language)} onClick={this.handleOk} />
        </Button.Group>
      </Col>
    </Row>
  );

  onChange = value => {
    const { data } = this.state;
    this.setState({
      data: data.map((item, index) => {
        if (index < value) {
          return { disabled: true, ...item };
        } else {
          const { disabled, ...rest } = item;
          return rest;
        }
      }),
    });
  };

  StandardTableTitle = () => {
    const {
      form: { getFieldDecorator },
      oldDataSource,
    } = this.props;
    const { data } = this.state;
    const initialValue = data.filter(v => v.fixed).length;
    const min = oldDataSource.filter(v => v.fixed).length;
    return (
      <AntdForm>
        <AntdFormItem
          label={transferLanguage('base.condition.fixColumns', this.props.language)} 
          code="freezingColumn"
          initialValue={initialValue}
          getFieldDecorator={getFieldDecorator}
        >
          <AntdInput
            min={min}
            max={4}
            style={{ width: 200 }}
            type="number"
            onChange={this.onChange}
          />
        </AntdFormItem>
      </AntdForm>
    );
  };

  handleSelectRows = selectedKeys => {
    this.setState({
      selectedKeys,
    });
  };

  onMouse = dataIndex => {
    this.setState({ display: dataIndex });
  };

  render() {
    const { selectedKeys, data } = this.state;
    const { visible, setVisible } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <AdModal
        wrapClassName={styles['custom-field-setting']}
        visible={visible}
        onCancel={setVisible}
        title={this.AdModalHeader()}
        footer={false}
      >
        <Table
          title={this.StandardTableTitle}
          columns={this.columns}
          rowSelection={rowSelection}
          dataSource={data}
          rowKey={record => record.dataIndex}
          pagination={false}
          scroll={{ x: 500, y: 400 }}
          components={this.components}
          onRow={(record, index) => {
            return {
              onMouseEnter: () => {
                if (record.disabled) return;
                this.onMouse(record.dataIndex);
              }, // ???????????????
              onMouseLeave: () => {
                this.onMouse('');
              },
              index,
              moveRow: this.moveRow,
            };
          }}
        />
      </AdModal>
    );
  }
}

export default DragDropContext(HTML5Backend)(DragSortingTable);

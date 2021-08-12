import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Tooltip, InputNumber } from 'antd';
import styles from './index.less';
const { TextArea, Password } = Input;

export default class AntdInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      tooltip: '',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  getPattern = () => {
    const { mode } = this.props;
    let data = { pattern: '', content: '' };
    switch (mode) {
      case 'money':
        data = {
          pattern: '^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$',
          content: `输入数字,可保留两位小数!`,
        };
        break;
      case 'number':
        data = {
          // pattern: '^d{64}$',
          pattern: '^[1-9,-]\\d{0,64}$',
          content: `输入数字，长度不超过64位`,
        };
        break;
      case 'anyNumber':
        data = {
          pattern: '^[0-9|.]*$',
          content: `输入整数或者浮点数`,
        };
        break;
      case 'scoring':
        data={
          pattern: '^[0-9]\\d{0,2}$',
          content: `记分不得超过12分`,
        }
    }
    return data;
  };

  onChange = e => {
    const { maxlen, mode, onChange, type } = this.props;
    let value = null;
    let tooltip = '';
    if (type === 'number') {
      value = e;
    } else {
      value = e.target.value.trim();
    }
    const { pattern, content } = this.getPattern();

    if (pattern && value) {
      const reg = new RegExp(pattern, 'g');
      const length = 18;
      if (!reg.test(value)) {
        this.setState({ tooltip: content });
        return;
      }
      if (mode === 'money' && length < value.length) {
        value = value.substring(0, length);
        this.setState({ tooltip: `长度不超过18位!` });
      }
    }
    if (maxlen && maxlen < value.length) {
      this.setState({ tooltip: `长度不超过${maxlen}位!` });
      value = value.substring(0, maxlen);
    }
    tooltip = value;
    this.setState({ value, tooltip });
    this.triggerChange(value);
  };

  render() {
    const { type, onChange, ...rest } = this.props;
    const { value, tooltip } = this.state;
    const params = {
      value,
      onChange: e => {
        this.onChange(e);
      },
      // placeholder: formatMessage({ id: 'form.input.placeholder' }),
      ...rest,
    };
    
    const style = { width: '100%' };
    params.style = style;
    let content = <Input {...params} />;
    switch (type) {
      case 'textarea':
        content = <TextArea {...params} />;
        break;
      case 'password':
        content = <Password {...params} />;
      case 'number':
        content = <InputNumber {...params} />;
        break;
    }
    return (
      <Tooltip
        trigger={['focus']}
        title={tooltip || params.placeholder}
        placement="topRight"
        overlayClassName={styles['numeric-input']}
      >
        {content}
      </Tooltip>
    );
  }
}

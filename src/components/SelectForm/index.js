import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Button, Icon, Input } from 'antd';
import { editGutter, listCol } from '@/utils/constans';
import AdButton from '@/components/AdButton';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';
import AntdFormItem from '@/components/AntdFormItem';

const FormItem = Form.Item;

@connect(({ i18n }) => ({
	language: i18n.language
}))
export default class SelectForm extends Component {
	state = {
		expandForm: false,
	};
	toggleForm = () => {
		const { expandForm } = this.state;
		const { toggleForm } = this.props;
		if (toggleForm) toggleForm(!expandForm);
		this.setState({
			expandForm: !expandForm,
		});
		// this.handleFormReset()
	};

	handleFormReset = () => {
		const { form: { getFieldValue }, form, handleFormReset } = this.props;
		form.resetFields();
		handleFormReset();
	};

	handleSearch = e => {
		e.preventDefault();
		const { form, handleSearch } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			const values = {
				...fieldsValue,
				updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
			};
			handleSearch(values);
		});
	};

	operatorButtons = ({ value, textAlign, }) => {
		const { code, handleFormReset, otherFormItem } = this.props;
		const marginLeft = { marginLeft: 8 };
		// console.log('otherFormItem',otherFormItem,Boolean(otherFormItem))
		return (
			<Col {...listCol} style={{ textAlign }}>
				<span className={styles.submitButtons}>
					<Button.Group>
						<AdButton type="primary" htmlType="submit" text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
						{handleFormReset && <AdButton onClick={this.handleFormReset} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />}
					</Button.Group>
					{otherFormItem && (
						<a style={marginLeft} onClick={this.toggleForm}>
							{value} <Icon type={`${value === transferLanguage('base.prompt.unfold', this.props.language) ? 'down' : 'up'}`} />
						</a>
					)}
				</span>
			</Col>
		);
	};
	renderSimpleForm() {
		const { firstFormItem, secondFormItem, otherFormItem, quickQuery,width, form: { getFieldDecorator } } = this.props;
		const commonParams = {getFieldDecorator};
		let components = (
			<Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
				<Row hidden={!quickQuery} gutter={editGutter}>
					<Col {...listCol}>
						<AntdFormItem label={transferLanguage('base.condition.quickSearch', this.props.language)}
							width={width}
							code='keyWord'
							{...commonParams}
						>
							<Input placeholder="" />
						</AntdFormItem>
					</Col>
					{this.operatorButtons({ value: transferLanguage('base.prompt.unfold', this.props.language), textAlign: 'left', quickQuery })}
				</Row>
				<Row hidden={quickQuery} gutter={editGutter}>
					<Col {...listCol}>{firstFormItem}</Col>
					{secondFormItem && <Col {...listCol}>{secondFormItem}</Col>}
					{this.operatorButtons({ value: transferLanguage('base.prompt.unfold', this.props.language), textAlign: 'left', quickQuery })}
				</Row>
			</Form>
		);
		return components
	}

	renderAdvancedForm() {
		const { otherFormItem, firstFormItem, secondFormItem } = this.props;
		const coll = {
			labelCol: { span: 12 },
			wrapperCol: { span: 12 },
		}
		return (
			// listCol = { md: 8, sm: 24 };
			<Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
				<Row gutter={editGutter}>
					<Col {...listCol} >{firstFormItem}</Col>
					<Col {...listCol}>{secondFormItem}</Col>
					{otherFormItem && <Col {...listCol}>{otherFormItem[0][0]}</Col>}
					{!otherFormItem && this.operatorButtons({ value: transferLanguage('base.prompt.retract', this.props.language), textAlign: 'left', otherFormItem })}
				</Row>
				{otherFormItem && otherFormItem.map((row, rowId) => {
					if (rowId === 0) return;
					return (
						<Row gutter={editGutter} key={rowId}>
							{row.map((col, colId) => {
								return (
									<div key={`${rowId}-${colId}`}>
										{col === 'operatorButtons' ? (
											colId === 0 ? (
												<Fragment>
													<Col {...listCol} />
													<Col {...listCol} />
													{this.operatorButtons({
														value: transferLanguage('base.prompt.retract', this.props.language),
														textAlign: 'right',
														otherFormItem,
													})}
												</Fragment>
											) : (
													this.operatorButtons({ value: transferLanguage('base.prompt.retract', this.props.language), textAlign: 'left', otherFormItem })
												)
										) : (
												<Col {...listCol}>{col}</Col>
											)}
									</div>
								);
							})}
						</Row>

					);
				})}

			</Form>
		);
	}

	render() {
		const { expandForm } = this.state;
		const { className } = this.props;
		return (
			<div className={className}>
				{expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
			</div>
		);
	}
}

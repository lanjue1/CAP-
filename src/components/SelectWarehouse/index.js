import React, { PureComponent } from 'react';
import { Menu, Icon, Dropdown, Button, } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './index.less';
import {
	TranslationOutlined, BankOutlined,GlobalOutlined
} from '@ant-design/icons';
@connect(({ selectWarehouse, login }) => ({
	login,
	selectWarehouseList: selectWarehouse.list,
	user: login.user
}))
export default class SelectWarehouse extends PureComponent {
	state = {
		selectName: '',
		selectWarehouse:'',
	}
	componentDidMount() {
		const { dispatch, user,selectWarehouseList } = this.props
		dispatch({
			type: 'selectWarehouse/fetchUserWarehouseList',
			payload: { userId: user.id },
			callback: (res) => {
				const selectObj = user.currentWarehouse && res && res.filter(item => item.id == user.currentWarehouse).length > 0 ?
						res.filter(item => item.id == user.currentWarehouse) : []
				if (localStorage.getItem('flag')) {
					selectObj[0].timeZone && localStorage.setItem('timeZone', selectObj[0].timeZone)
					this.setState({
						selectName: localStorage.getItem('timeZone') ? localStorage.getItem('timeZone') : selectObj.length > 0 && selectObj[0].timeZone ? selectObj[0].timeZone : 'UTC+8',
						selectWarehouse:selectObj && selectObj[0] ? selectObj[0].code : 'TH01'
					})
					localStorage.removeItem('flag')
				} else {
					this.setState({
						selectName: localStorage.getItem('timeZone'),
						
					})
				}
				this.setState({
					selectWarehouse:selectObj && selectObj[0] ? selectObj[0].code : 'TH01'
				})

			}
		})
	}

	changeWarehouse = ({ key, }) => {
		const { dispatch, user,selectWarehouseList } = this.props
		const _key=selectWarehouseList.filter(v=>v.code===key)[0].id
		dispatch({
			type: 'selectWarehouse/fetchSwitchWarehouse',
			payload: {
				bindingWarehouseId: _key,
				userId: user.id
			},
			callback: (res) => {
				console.log('key=====',key)
				res&&res.timeZone&&localStorage.setItem('timeZone',res.timeZone)
				this.setState({
					selectWarehouse: key
				})
				dispatch({
					type: 'selectWarehouse/fetchUserWarehouseList',
					payload: { userId: user.id },
					callback: (res) => {
						localStorage.setItem('flag', true)
						window.location.reload();
					}
				})
			}
		})
	}
	changeTimeZone = ({ key }) => {
		localStorage.setItem('timeZone', key)
		this.setState({
			selectName: key
		})
		window.location.reload();
	}

	render() {
		const { selectWarehouseList, user } = this.props
		const { selectName,selectWarehouse } = this.state
		const timeZonelist = ['UTC+7', 'UTC+8', 'UTC+9']
		const defaultWarehouse = selectWarehouseList.filter(v => v.id === user.currentWarehouse)
		let _ = defaultWarehouse && defaultWarehouse[0] ? defaultWarehouse[0].code : 'TH01'
		let _defaultWarehouse = _ ? (_ + ' | ') : ''
		const selectedLang = localStorage.getItem('language_type') ? localStorage.getItem('language_type') : 'en-US';
		// let indexOf=selectedLang.lastIndexOf('-')
		// const lang=selectedLang.slice(indexOf + 1, selectedLang.length)
		const _selectWarehouseList=selectWarehouseList.map(v=>v.code)
		const timeZoneMenu = (<Menu className={styles.menu} selectedKeys={selectName} onClick={this.changeTimeZone}  >
			{timeZonelist.map(item => (<Menu.Item key={item}>
				{item}
			</Menu.Item>))
			}
		</Menu>)
		const menu = (<Menu className={styles.menu} selectedKeys={selectWarehouse} onClick={this.changeWarehouse}  >
			{_selectWarehouseList && _selectWarehouseList.map(item => (<Menu.Item key={item}>
				{item}
			</Menu.Item>))
			}
		</Menu>)
		return (
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'conter' }} >
				<HeaderDropdown overlay={menu} placement="bottomLeft">
					<span style={{marginRight: '8px',}}>
						<BankOutlined style={{ marginLeft:'3px' }} />
						{_defaultWarehouse}
					</span>
				</HeaderDropdown>
				<HeaderDropdown overlay={timeZoneMenu} placement="bottomLeft">
					<span className={classNames(styles.dropDown)} style={{marginRight: '8px'}} >
						<GlobalOutlined style={{ marginLeft:'3px',marginRight:'3px' }}/>
						{selectName + ' | '}
					</span>
				</HeaderDropdown>
			</div>)
	}
}
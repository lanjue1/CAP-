import React, { Component, Fragment } from 'react';
import { Card,Select,Input,  Upload,Icon, Button, Form,Modal} from 'antd';
import { connect } from 'dva';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AdSelect from '@/components/AdSelect';
import reqwest from 'reqwest';
import prompt from '@/components/Prompt';
import AdButton from '@/components/AdButton';
//import AdModal from '@/components/AdModal';
import { stringify } from 'qs';
import {codes} from './utils';
 
import {
    formItemFragement,
  } from '@/utils/common';
require ('./Leadinport.less')

@connect(({ leadInPort, loading, common }) => ({
    leadInPort,
    getCustomerList: leadInPort.getCustomerList,
    // formValues: leadInPort.formValues,
    // loading: loading.effects[allDispatchType.detail],
  }))
  @Form.create()
export default class LeadInPort extends Component {
    constructor(props){
        super(props);
        this.state={
            selectValue:'',
            customerType:[],
            customerInfo:[],
            key:0,
            fileList:[],
            visible:false,
            messages:[],
           excelUrl:'',
        }
    }
    componentDidMount(){
       // console.log(this.props)

        this.getCustomerInfo()
        

    }
    componentDidUpdate(){
       // console.log('12',this.state.customer) 
    }
    getCustomerInfo=()=>{
        const { dispatch } = this.props;
       
        dispatch({
          type: 'leadInPort/selectCustomerTypes',
          payload:{},
          callback: data => {
            if (!data) return;
            const newData = data.map(v=>{
                return {code:v.customer,value:v.customer,types:v.types,excelUrl:v.excelUrl}
            })
          
            this.setState({
                // customerType:data.types|| [],
                customerInfo:newData
            })
                                                           
            
          },
        });
        
    }
    // 选择客户类型
    handleChange=(e)=>{
     // this.props.form.setFieldsValue({ fileTokens: res });
      this.props.form.setFieldsValue({ type: "" });
       const data = this.state.customerInfo.find((v)=>e===v.value);
       this.setState({
        customerType:data ? data.types || []: [],
        excelUrl:'',
    })
  }
  //选择反馈类型
    typesChange=(e)=>{     
      const selectType=this.state.customerType.find((v)=>{      
        return e===v.type
      })    
      this.setState({
        excelUrl:selectType?selectType.excelUrl||"":'',
      })
      console.log('excelUrl---',this.state.excelUrl,selectType.type)
    }
    // 上传文件
    uploadExcel=(e)=>{
     // console.log(e)
      let fileList=this.refs.pathClear.value

      this.setState({
        fileList
      })

    }
    confirm=()=>{
        const {fileList} = this.state;
          const {
            form,dispatch
          } = this.props;
          form.validateFieldsAndScroll((err, values) => {
            if (err) {
              return  prompt({ content: "请选择接口信息", type: 'error' });
            }
            
          const { ...params } = values;      
          const formData = new FormData();
          fileList.forEach(file => {
            formData.append('file', file);
          });
          this.setState({
            uploading: true,
          });
          reqwest({
            url: `/server/api/track/track-order/General/importExcel?${stringify(params)}`,
            method: 'post',
            processData: false,
            data: formData,
            headers: {
              token: localStorage.getItem('token'),
            },
            contentType: 'multipart/form-data',

            success: res => {
              const { code, message,data } = res;
             
              if (code == 0) {

                this.setState({
                  messages:data.messages,
                  visible:true,
                  
                });
                this.setState({
                  fileList:[]
                })
               

              } else {
                prompt({ content: message, type: 'error' });
              }
            },
            error: () => {
              this.setState({
                uploading: false,
              });
              prompt({ content: '上传失败',type: 'error' });
            },
          });
          });
         
    }
    render() {
        const {customerInfo,customerType,fileList,excelUrl} = this.state;
        console.log('excelUrl--168---',excelUrl)

        // const detail = {};
        const { form } = this.props;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
          };
       // const urlCase=`attachment/${excelUrl}`;  //urlCase={`attachment/轨迹更新导入模板.xlsx`}
        const formItem = [
            [
            <AntdFormItem
                label="客户类别"
                rules={[{ required: true }]}
                code="customer"
                rules={[{ required: true }]}
                // initialValue={detail.customer}
                {...commonParams}
              >
                <AdSelect
                  isExist={true}
                  data={customerInfo}
                  onChange={(e)=>this.handleChange(e)}
                />
              </AntdFormItem>,
              <AntdFormItem
                label="反馈类型"
                rules={[{ required: true }]}
                code="type"
                // initialValue={detail.type}
                {...commonParams}
              >
                <AdSelect
                  isExist={true}
                  data={customerType}
                  onChange={(e)=>this.typesChange(e)}
                  show = { { id: 'type', name: 'name' }}
                />

              </AntdFormItem>,
            ]
          ];
          const editPageParams = {
            title: '接口导入',
            // headerOperate: this.headerOperate(),
            panelValue: [{ key: '基础信息' }],
          };
          const propsFile = {
            // 点击移除图标
            onRemove: file => {
              
              this.setState(state => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                console.log('newFileList',newFileList)
                return {
                  fileList: newFileList,
                };
              });
            },

            beforeUpload: file => {
              console.log('file',file)

              this.setState(state => ({
               // 显示所有上传的文件 fileList: [...state.fileList, file],
               fileList: [file],
             //  fileList:[]
              }));
              return false;
            },
            fileList,
            accept:'.xls,.xlsx'
          };
         
        
        //   <FileImport
        //   visibleFile={visibleFile}
        //   handleCancel={() => {
        //     this.handleImportFile();
        //   }}
        //   urlImport={`track/track-order/importTrack`}
        //   urlCase={`attachment/轨迹更新导入模板.xlsx`}
        //   // queryData={[this.getSelectList]}
        //   accept=".xls,.xlsx"
        // />
        return (
             <div>
               <EditPage {...editPageParams}>
                  <div style={{marginTop:80,height:400}}>
                  <AntdForm>{formItemFragement(formItem)}
                  <div style={{display:'flex',width:'100%',justifyContent:'center',marginTop:40}}>
                  <div  style={{flex:1,marginLeft:120,marginRight:20}}>
                    
                  {excelUrl && (
              <div style={{ marginBottom: 16 }}>
                <a href={`http://${window.location.host}/attachment/${excelUrl}`} download>
                  下载模板
                </a>
              </div>
            )}
                  
                   {/* {excelUrl && (
                    <div style={{ marginBottom: 16 }}>
                      <a href={`http://${window.location.host}/attachment/${excelUrl}`}  download>
                        
                  
                      </a>
                    </div>
                  )}  */}
                   
                    {/* <div style={{ marginBottom: 16 }}>
                      <a href={`http://${window.location.host}/${excelUrl}`}  download>
                        下载模板
                      </a>
                    </div> */}
                  
                  <Upload {...propsFile} >
                    <Button style={{width:100}}>
                      <Icon type="upload" /> 附件
                    </Button>
                   
                      <p style={{ color: 'red', marginTop: 12, marginbottom: 0 }}>
                        （提示：支持 .xls,xlsx 格式文件）
                      </p>
                    
                  </Upload>
                  </div>
                    
                  </div>


                  <div  style={{display:'flex',justifyContent: 'center',marginTop: 40}}>

                        <AdButton
                                text="确认"
                                type="primary"
                                style={{width:200}}
                                code={codes.confirm}
                                onClick={() => this.confirm()}
                                disabled={!fileList.length}
                            />
                    </div>
                  </AntdForm>  

                 </div>    

                
          </EditPage> 
          <Modal
              visible={this.state.visible}
              title="接口导入"
              onOk={()=>{
                this.setState({
                  visible:false
                })
              }}
              onCancel={() => {
                this.setState({
                  visible:false
                })
              }}
              width="60%"
              style={{
                maxWidth: 600,
              }}
            >
              <div style={{color:'#262626',}}>               
                
                {
                ( this.state.messages||[]).map((item,key)=>{
                      return (
                      <div key={key} style={{borderBottom:'1px solid #E8E8E8',color:'#000000',marginBottom:12 }}>{item}</div>
                      )
                  })
                } 
              </div>
            </Modal>

             </div>

        )
    }
}

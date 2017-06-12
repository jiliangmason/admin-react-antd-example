import {Modal, Input, Form, notification, Icon } from 'antd'
import React from 'react'
import axios from 'axios'
const FormItem = Form.Item

let visible = false
class addUpkeep extends React.Component {
    state = {
        visible: true
    }
    componentDidUpdate () {
        if (this.props.id > 0) {
            axios({
                method: 'post',
                url: 'http://192.168.1.108:18082/upkeep/getUpkeep',
                params: {
                    id: this.props.id
                }
            }).then(response => {
                let resulData = response.data
                this.props.form.setFieldsValue({
                    tollAmount: resulData.data.tollAmount
                })
            }).catch(error => {
                alert(error)
            })
        }
        visible = this.props.visible
    }
    // 单击确定按钮提交表单
    handleSubmit = () => {
        console.log(this.props.form.getFieldsValue())
        axios({
            method: 'post',
            url: 'http://192.168.1.108:18082/upkeep/addupkeep',
            params: this.props.form.getFieldsValue()
        }).then(response => {
            notification.open({
                message: '添加成功',
                icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />
            })
            this.props.refreshTable()
        }).catch(error => {
            this.props.refreshTable()
        })
        visible = false
        this.setState({ visible: false })
    }
    handleCancel = (e) => {
        visible = false
        this.setState({ visible: false })
    }
    onBlur = () => {
        let purchasePrice = this.props.form.getFieldValue('purchasePrice')
        let serviceCharge = this.props.form.getFieldValue('serviceCharge')
        if (typeof (purchasePrice) === 'undefined') {
            purchasePrice = 0
        }
        if (typeof (serviceCharge) === 'undefined') {
            serviceCharge = 0
        }
        this.props.form.setFieldsValue({
            tollAmount: (parseFloat(purchasePrice) + parseFloat(serviceCharge)).toFixed(0)
        })
    }
    render () {
        const { getFieldProps } = this.props.form
        if (this.state.visible) {
            visible = this.props.visible
        }

        return (
            <div>
                <Modal
                    title="增加收费项"
                    style={{top: 20}}
                    width="400"
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form layout="horizontal">
                        <FormItem label="物品名称" labelCol={{ span: 5 }}
                                  wrapperCol={{ span: 15 }}
                        >
                            <Input type="text" {...getFieldProps('entryName')} />
                        </FormItem>
                        <FormItem label="单位" labelCol={{ span: 5 }}
                                  wrapperCol={{ span: 15 }}
                        >
                            <Input type="text" {...getFieldProps('company')} />
                        </FormItem>
                        <FormItem label="进货价格" labelCol={{ span: 5 }}
                                  wrapperCol={{ span: 15 }}
                        >
                            <Input onBlur={this.onBlur} type="text" {...getFieldProps('purchasePrice')} />
                        </FormItem>
                        <FormItem label="服务费" labelCol={{ span: 5 }}
                                  wrapperCol={{ span: 15 }}
                        >
                            <Input onBlur={this.onBlur} type="text" {...getFieldProps('serviceCharge')} />
                        </FormItem>
                        <FormItem label="收费金额" labelCol={{ span: 5 }}
                                  wrapperCol={{ span: 15 }}
                        >
                            <Input type="text" {...getFieldProps('tollAmount')} />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

let Addupkeep = Form.create()(addUpkeep)

export default Addupkeep

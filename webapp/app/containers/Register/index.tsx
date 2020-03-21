
import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { createStructuredSelector } from 'reselect'

import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import saga from './sagas'

import { Icon, message } from 'antd'
import RegisterForm from './RegisterForm'
import SendEmailTips from './SendEmailTips'
const styles = require('../Login/Login.less')
import { checkNameAction } from '../App/actions'
import { signup, sendMailAgain } from './actions'
import { makeSelectSignupLoading } from './selectors'
import { InjectedRouter } from 'react-router/lib/Router'

interface IRegisterProps {
  router: InjectedRouter
  signupLoading: boolean
  onSendEmailOnceMore: (username: string, email: string, resolve?: (res: any) => any) => any
  onSignup: (username: string, email: string, password: string, resolve?: (res: any) => any) => any
  onCheckName: (id: number, name: string, type: string, param?: any, resolve?: (res: any) => any, reject?: (error: any) => any) => any
}

interface IRegisterStates {
  step: string
  username: string
  email: string
  password: string
  password2: string
}

export class Register extends React.PureComponent<IRegisterProps, IRegisterStates> {
  constructor (props) {
    super(props)
    this.state = {
      step: 'first',
      username: '',
      email: '',
      password: '',
      password2: ''
    }
  }

  private changeUsername = (e) => {
    this.setState({
      username: e.target.value.trim()
    })
  }

  private onChangeEmail = (e) => {
    this.setState({
      email: e.target.value.trim()
    })
  }

  private changePassword = (e) => {
    this.setState({
      password: e.target.value.trim()
    })
  }

  private changePassword2 = (e) => {
    this.setState({
      password2: e.target.value.trim()
    })
  }

  private signUp = () => {
    const { onSignup } = this.props
    const { username, email, password, password2} = this.state
    if(username.length==0){
    	message.error('用户名不能为空')
        return
    }
    if(email.length==0){
    	message.error('邮箱不能为空')
        return
    }
    if(password.length==0 || password2.length==0){
    	message.error('密码不能为空')
        return
    }
    const emailRep = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
	if (!emailRep.test(email)) {
		message.error('无效的邮箱地址')
        return
	}
	if (password.length < 6 || password.length > 20) {
        message.error('密码长度为6-20位')
        return
	}
	if (password !== password2) {
        message.error('两次输入的密码不一致')
        return
	}
	onSignup(username, email, password, () => {
        this.setState({
          step: 'second'
        })
	})
  }

  private goBack = () => {
    this.setState({
      step: 'first'
    })
  }

  private toLogin = () => {
    const { router } = this.props
    router.replace('/login')
  }

  private sendEmailOnceMore = () => {
    const { onSendEmailOnceMore } = this.props
    const { username, email } = this.state
    if(username.length==0){
    	message.error('用户名不能为空')
        return
    }
    if(email.length==0){
    	message.error('邮箱不能为空')
        return
    }
    onSendEmailOnceMore(username, email,  (res) => {
      message.success(res)
    })
  }

  public render () {
    const { step, username, email } = this.state
    const { onCheckName, signupLoading} = this.props
    const firstStep = (
        <div className={styles.window}>
          <Helmet title="Register" />
          <RegisterForm
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
            password2={this.state.password2}
            onChangeUsername={this.changeUsername}
            onChangeEmail={this.onChangeEmail}
            onChangePassword={this.changePassword}
            onChangePassword2={this.changePassword2}
            onCheckName={onCheckName}
            onSignup={this.signUp}
          />
          <button
            disabled={signupLoading}
            onClick={this.signUp}
          >
            {
              signupLoading
                ? <Icon type="loading" />
                : ''
            }
            注册
          </button>
          <p className={styles.tips}>
            <span>已有DQ账号 </span>
            <a href="javascript:;" onClick={this.toLogin}>单击登录</a>
            <span>， 账号激活 </span>
            <a href="javascript:;" onClick={this.sendEmailOnceMore}>重发邮件</a>
          </p>
        </div>
      )
    const secondStep = (
        <div className={styles.window}>
          <Helmet title="Register" />
          <SendEmailTips
            email={email}
            goBack={this.goBack}
            sendEmailOnceMore={this.sendEmailOnceMore}
          />
        </div>
      )

    return step === 'first' ? firstStep : secondStep
  }
}

const mapStateToProps = createStructuredSelector({
  signupLoading: makeSelectSignupLoading()
})

export function mapDispatchToProps (dispatch) {
  return {
    onSignup: (username, email, password, resolve) => dispatch(signup(username, email, password, resolve)),
    onCheckName: (id, name, type, params, resolve, reject) => dispatch(checkNameAction(id, name, type, params, resolve, reject)),
    onSendEmailOnceMore: (username, email, resolve) => dispatch(sendMailAgain(username, email, resolve))
  }
}

const withConnect = connect<{}, {}, IRegisterProps>(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'register', reducer })
const withSaga = injectSaga({ key: 'register', saga })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Register)




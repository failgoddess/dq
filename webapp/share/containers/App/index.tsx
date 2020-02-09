
import * as React from 'react'
import Helmet from 'react-helmet'

import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import saga from './sagas'

export function App (props) {
  return (
    <div>
      <Helmet
        titleTemplate="%s - DQ"
        defaultTitle="DQ Web Application"
        meta={[
          { name: 'description', content: 'DQ web application built for data visualization' }
        ]}
      />
      {React.Children.toArray(props.children)}
    </div>
  )
}

const withReducer = injectReducer({ key: 'global', reducer })
const withSaga = injectSaga({ key: 'global', saga })

export default compose(
  withReducer,
  withSaga
)(App)

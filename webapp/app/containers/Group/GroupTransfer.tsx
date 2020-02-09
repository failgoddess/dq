

import * as React from 'react'

import { Row, Col, Transfer } from 'antd'

interface IGroupTransferProps {
  source: any[]
  target: any[]
  onChange: (nextTargetKeys: any) => void
}

const getRowKey = (s) => s.id
const transferRender = (item) => item.name
const onChange = (cb) => (nextTargetKeys, direction, moveKeys) => {
  cb(nextTargetKeys)
}

export function GroupTransfer (props: IGroupTransferProps) {
  return (
    <Row>
      <Col span={24}>
        <Transfer
          titles={['列表', '已选']}
          listStyle={{width: '220px'}}
          dataSource={props.source}
          rowKey={getRowKey}
          targetKeys={props.target}
          render={transferRender}
          onChange={onChange(props.onChange)}
        />
      </Col>
    </Row>
  )
}

export default GroupTransfer

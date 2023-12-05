import { Spin } from 'antd';
import React from 'react'

type Props = {
  children?: React.ReactNode;
  spinning: boolean;
}

const SpinDiv = ({ spinning, children }: Props) => {
  return (
    <Spin tip="Loading..." spinning={spinning}>
      {children}
    </Spin>
  )
}

export default SpinDiv;
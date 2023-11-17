import BranchTable from '@/app/components/UI/Table/BranchTable';
import BranchFrom from '@/app/components/UI/ฺFrom/BranchFrom';
import React, { useState } from 'react'

type Props = {}

const BranchPage = (props: Props) => {
  return (
    <div>
      <BranchFrom />
      <div className="w-full overflow-x-auto p-3">
        <BranchTable />
      </div>
    </div>
  )
}

export default BranchPage
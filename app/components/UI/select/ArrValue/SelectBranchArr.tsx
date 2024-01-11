import { RadioChangeEvent, Select, SelectProps } from 'antd';
import React from 'react'

type Props = {}

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
    options.push({
        value: i.toString(36) + i,
        label: i.toString(36) + i,
    });
}

const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
};

const SelectBranchArr = (props: Props) => {

    return (
        <Select
            mode="multiple"
            size="middle"
            placeholder="Please select"
            defaultValue={[]}
            onChange={handleChange}
            style={{ width: '200px' }}
            options={options}
        />
    )
}

export default SelectBranchArr
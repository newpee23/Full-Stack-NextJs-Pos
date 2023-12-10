import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';

interface Props {
  setSegmentedShow: React.Dispatch<React.SetStateAction<SegmentedValue>>;
}
const SegmentedShow = ({setSegmentedShow} : Props) => {
  return (
    <Segmented
      defaultValue="1"
      options={[
        { label: 'แสดงตามโต๊ะ', value: '1', icon: <BarsOutlined /> },
        { label: 'แสดงตามบิล', value: '2', icon: <AppstoreOutlined /> },
      ]}
      onChange={(value) => setSegmentedShow(value)}
    />
  );
};

export default SegmentedShow;

import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';

const SegmentedShow = () => {
  const handleSegmentChange = (value: SegmentedValue) => {
    console.log('Selected value:', value);
  };

  return (
    <Segmented
      defaultValue="1"
      options={[
        { label: 'List', value: '1', icon: <BarsOutlined /> },
        { label: 'Kanban', value: '2', icon: <AppstoreOutlined /> },
      ]}
      onChange={(value) => handleSegmentChange(value)}
    />
  );
};

export default SegmentedShow;

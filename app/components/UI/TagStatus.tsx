import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

const STATUS_COLORS = {
  success: 'success',
  error: 'error',
};

type Props = { textShow: string; color: keyof typeof STATUS_COLORS };

const TagStatus = (props: Props) => {
  const { textShow, color } = props;
  const icon = color === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  const tagColor = STATUS_COLORS[color];

  return (
    <Tag icon={icon} color={tagColor}>
      {textShow}
    </Tag>
  );
};

export default TagStatus;

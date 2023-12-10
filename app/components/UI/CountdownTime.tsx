import React from 'react';
import type { CountdownProps } from 'antd';
import { Col, Row, Statistic } from 'antd';

const { Countdown } = Statistic;

// ปรับเวลานับถอยหลังให้นับจากเวลาปัจจุบัน
const now = new Date().getTime();
const minutesToAdd = 120; // เพิ่มเวลานับถอยหลังอีก 15 นาที
const deadline = now + minutesToAdd * 60 * 1000;

const onFinish: CountdownProps['onFinish'] = () => {
  console.log('finished!');
};

const CountdownTime = () => (
  <Row gutter={16}>
    <Col span={12}>
      <Countdown title="" value={deadline} onFinish={onFinish} />
    </Col>
  </Row>
);

export default CountdownTime;

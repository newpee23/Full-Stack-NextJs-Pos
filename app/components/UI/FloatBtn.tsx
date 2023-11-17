import { UpOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'

const FloatBtn = () => {

  const handleScrollTop = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (<FloatButton onClick={handleScrollTop} icon={<UpOutlined />} />)
}

export default FloatBtn
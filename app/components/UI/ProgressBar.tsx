import { setLoading } from '@/app/store/slices/loadingSlice';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { Progress } from 'antd';
import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
  const dispatch = useAppDispatch();
  const loadingAction = useAppSelector((state) => state.loadingSlice.loadingAction);
  const showLoading = useAppSelector((state) => state.loadingSlice.showLoading);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const setLoadingAction = () => {
      if (loadingAction === 100) {
        const timeoutId = setTimeout(() => {
          setIsVisible(false);
          dispatch(setLoading({loadingAction: 0,showLoading: false}));
        }, 1000);
  
        return () => clearTimeout(timeoutId);
      } else {
        setIsVisible(true);
      }
    }

    setLoadingAction()
  }, [loadingAction]);

  return isVisible && showLoading ? <Progress percent={loadingAction} status="active"  size="small"  strokeColor={{ from: '#108ee9', to: '#87d068' }}/> : null;
};

export default ProgressBar;

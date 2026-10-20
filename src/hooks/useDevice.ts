import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isTouch: false,
        orientation: 'portrait',
        screenWidth: 1024,
      };
    }

    const width = window.innerWidth;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isUserAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const isMobile = width < 768 || isUserAgentMobile;
    const isTablet = width >= 768 && width < 1024;
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

    return {
      isMobile,
      isTablet,
      isTouch,
      orientation,
      screenWidth: width,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isUserAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      setDeviceInfo({
        isMobile: width < 768 || (isUserAgentMobile && width < 900),
        isTablet: width >= 768 && width < 1024 && !isUserAgentMobile,
        isTouch,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        screenWidth: width,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}

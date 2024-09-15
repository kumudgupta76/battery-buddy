import { Col, Row, Typography, Progress, Spin, notification, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BatteryStatus = () => {

  const [value, setValue] = useState(0);
  const [batterySupported, setBatterySupported] = useState(true);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [notificationClosed, setNotificationClosed] = useState(false);
  const [testValue, setTestValue] = useState(100);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Call your method here
    myMethod();
    }, 1000); // Interval of 1000 milliseconds (1 seconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run this effect only once when the component mounts

  const showNotification = (percentage) => {  
    Notification.requestPermission().then(perm => {
      console.log(perm);
      if (perm === 'granted' && (percentage < 20)) {

        console.log('Notification granted');
        const notificationjs = new Notification('Battery Low ⚠️', {
          body: `Battery is ${percentage}%`,
          icon: '/icon.png',
          requireInteraction: true
        });

        notificationjs.onclick = () => {
          notificationjs.close();
          setNotificationClosed(true);
        };

        notificationjs.onclose = () => {
          setNotificationClosed(true);
        };
      }
    });
  };
  // Method to be called at the interval
  const myMethod = () => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(function (battery) {
        // Update battery status initially
        updateBatteryStatus(battery);

        // Update battery status whenever it changes
        battery.addEventListener('chargingchange', function () {
          updateBatteryStatus(battery);
        });

        battery.addEventListener('levelchange', function () {
          updateBatteryStatus(battery);
        });
      });

      function updateBatteryStatus(battery) {
        var percentage = Math.round(battery.level * 100);
        setValue(percentage);
        setBatteryCharging(battery.charging);
        showNotification(percentage);
      }
    } else {
      setBatterySupported(false);
    }
  };

  const colorMap = {
    'red': '#ff4d4f',
    'green': '#52c41a',
    'blue': '#1890ff'
  };

  const gradientColorsMap = {
    'red': {
      '0%': '#ff4d4f',
      '100%': '#f47340'
    },
    'green': {
      '0%': '#87d068',
      '100%': '#52c41a',
    },
    'blue': {
      '0%': '#1890ff',
      '100%': '#74bcff',
    }
  }

  const getBatteryColor = (value) => {
    if (value < 20) {
      return 'red';
    } else if (value <= 70) {
      return 'blue';
    } else {
      return 'green';
    }
  };

  return (
    <div className='outer-container'>
      {
        batterySupported ?
          value === 0 ? <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 100,
                }}
                spin
              />
            }
          /> : <Row>
            <Col span={24} style={{ textAlign: 'center', justifyContent: "center" }}>
              <Title level={4}> Battery Status</Title>
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: '30px' }}>
              <Progress type='dashboard' percent={value} strokeColor={gradientColorsMap[getBatteryColor(value)]} size='large' />
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: '30px' }}>
              <Progress steps={5} percent={value} strokeWidth={30} strokeColor={colorMap[getBatteryColor(value)]} />
            </Col>
            {batteryCharging && <Col span={24} style={{ textAlign: 'center', justifyContent: "center", marginTop: '30px' }}>
              <Title level={4}>Charging⚡</Title>
            </Col>}
            <div><Button onClick={(e) => showNotification(12)}>Test Notification</Button></div>
          </Row>
          
          : <Title level={3}> Battery Status API not supported</Title>
      }
    </div>
  );
};
export default BatteryStatus;
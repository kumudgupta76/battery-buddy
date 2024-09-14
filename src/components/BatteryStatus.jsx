import { Col, Row, Typography, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BatteryStatus = () => {

  const [value, setValue] = useState(0);
  const [batterySupported, setBatterySupported] = useState(true);
  const [batteryCharging, setBatteryCharging] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Call your method here
      myMethod();
    }, 1000); // Interval of 1000 milliseconds (1 seconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run this effect only once when the component mounts

  // Method to be called at the interval
  const myMethod = () => {
    console.log('Method called every 1 second');
    // Add your method logic here

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
    'green' :{
      '0%': '#87d068',
      '100%': '#52c41a',
    },
    'blue':{
      '0%': '#1890ff',
      '100%': '#74bcff',
    }  }

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
              <Progress steps={5} percent={value} strokeWidth={30}  strokeColor={colorMap[getBatteryColor(value)]}/>

            </Col>
            {batteryCharging && <Col span={24} style={{ textAlign: 'center', justifyContent: "center", marginTop: '30px' }}>
              <Title level={4}>Charging⚡</Title>
            </Col>}
          </Row>
          : <Title level={3}> Battery Status API not supported</Title>
      }
    </div>
  );
};
export default BatteryStatus;
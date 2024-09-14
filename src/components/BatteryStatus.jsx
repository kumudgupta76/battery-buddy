import { Col, Row, Typography, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BatteryStatus = () => {
  const [battery, setBattery] = useState(null);
  const [value, setValue] = useState(0);
  const [batterySupported, setBatterySupported] = useState(true);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [notifiedLowBattery, setNotifiedLowBattery] = useState(false);

  useEffect(() => {
    // Request permission for notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBattery(battery);
        const updateBatteryStatus = () => {
          const percentage = Math.round(battery.level * 100);
          setValue(percentage);
          setBatteryCharging(battery.charging);

          // Show notification if battery level is below 20% and notification hasn't been shown
          if (percentage < 20 && !notifiedLowBattery) {
            showLowBatteryNotification(percentage);
            setNotifiedLowBattery(true);
          }

          // Reset notification flag if battery level goes above 20%
          if (percentage >= 20 && notifiedLowBattery) {
            setNotifiedLowBattery(false);
          }
        };

        updateBatteryStatus();

        battery.addEventListener('chargingchange', updateBatteryStatus);
        battery.addEventListener('levelchange', updateBatteryStatus);

        // Clean up event listeners on unmount
        return () => {
          battery.removeEventListener('chargingchange', updateBatteryStatus);
          battery.removeEventListener('levelchange', updateBatteryStatus);
        };
      });
    } else {
      setBatterySupported(false);
    }
  }, [notifiedLowBattery]); // Only add notifiedLowBattery as a dependency

  const colorMap = {
    red: '#ff4d4f',
    green: '#52c41a',
    blue: '#1890ff',
  };

  const gradientColorsMap = {
    red: {
      '0%': '#ff4d4f',
      '100%': '#f47340',
    },
    green: {
      '0%': '#87d068',
      '100%': '#52c41a',
    },
    blue: {
      '0%': '#1890ff',
      '100%': '#74bcff',
    },
  };

  const getBatteryColor = (value) => {
    if (value < 20) {
      return 'red';
    } else if (value <= 70) {
      return 'blue';
    } else {
      return 'green';
    }
  };

  const showLowBatteryNotification = (percent) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`⚠️ Low Battery Warning (${percent}%)🪫`, {
        body: 'Your battery is below 20%. Please charge your device.',
        icon: 'battery-64.png', // Replace with your icon path
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  return (
    <div className="outer-container">
      {batterySupported ? (
        value === 0 ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 100,
                }}
                spin
              />
            }
          />
        ) : (
          <Row>
            <Col span={24} style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Title level={4}>Battery Status</Title>
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: '30px' }}>
              <Progress
                type="dashboard"
                percent={value}
                strokeColor={gradientColorsMap[getBatteryColor(value)]}
                size="large"
              />
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: '30px' }}>
              <Progress
                steps={5}
                percent={value}
                strokeWidth={30}
                strokeColor={colorMap[getBatteryColor(value)]}
              />
            </Col>
            {batteryCharging && (
              <Col span={24} style={{ textAlign: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <Title level={4}>Charging⚡</Title>
              </Col>
            )}
                        {value !== 100 && (batteryCharging ? 
              <Col span={24} style={{ textAlign: 'center', justifyContent: 'center', marginTop: '30px' }}>
                <Title level={4}>{`Charging Time: ${battery.chargingTime} seconds`}</Title>
              </Col>
              :
              <Col span={24} style={{ textAlign: 'center', justifyContent: 'center', marginTop: '30px' }}>
              <Title level={4}>{`Discharging Time: ${battery.dischargingTime} seconds`}</Title>
            </Col>
            )}
            {value < 20 && (
              <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                <Title level={4} type="danger">
                  <ExclamationCircleOutlined /> Low Battery!
                </Title>
              </Col>
            )}
          </Row>
        )
      ) : (
        <Title level={3}>Battery Status API not supported</Title>
      )}
    </div>
  );
};

export default BatteryStatus;

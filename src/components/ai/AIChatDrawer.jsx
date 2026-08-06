import React, { useState } from 'react';
import { Drawer, Input, Button, Avatar, List, Tag, Space, Typography } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Text } = Typography;

const INITIAL_MESSAGES = [
  {
    sender: 'bot',
    text: 'Hello! I am CivicFix AI Assistant. How can I assist you today with municipal reporting, SLA timelines, or department procedures?',
    time: 'Just now'
  }
];

const AIChatDrawer = ({ open, onClose }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    const prompt = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Thank you for contacting CivicFix AI. You can submit any public infrastructure issue using our Report Issue page with automated image scanning.';

      const lower = prompt.toLowerCase();
      if (lower.includes('pothole') || lower.includes('road')) {
        botResponse = 'Pothole reports are routed to the Public Works Department (PWD). Standard SLA response time is 24-72 hours depending on priority level.';
      } else if (lower.includes('anonymous')) {
        botResponse = 'Yes! You can toggle the "Submit Anonymously" option during issue submission. Your name and contact details will be completely hidden from public view.';
      } else if (lower.includes('upvote') || lower.includes('priority')) {
        botResponse = 'Upvoting issues increases their community priority score! Higher upvoted complaints are highlighted on department officer dispatch queues.';
      } else if (lower.includes('water') || lower.includes('leak')) {
        botResponse = 'Water pipe leaks are categorized as Critical Priority and routed directly to the Water Supply Board emergency dispatch team.';
      }

      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: botResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Drawer
      title={
        <Space>
          <div style={{ background: '#1677FF', padding: 6, borderRadius: 8, color: '#fff', display: 'flex' }}>
            <CustomerServiceOutlined />
          </div>
          <span>CivicFix AI Support Assistant</span>
        </Space>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: item.sender === 'user' ? 'row-reverse' : 'row',
                    gap: 10,
                    width: '100%'
                  }}
                >
                  <Avatar
                    icon={item.sender === 'bot' ? <RobotOutlined /> : <UserOutlined />}
                    style={{ backgroundColor: item.sender === 'bot' ? '#1677FF' : '#52C41A' }}
                  />
                  <div
                    style={{
                      maxWidth: '80%',
                      background: item.sender === 'user' ? '#1677FF' : '#f0f2f5',
                      color: item.sender === 'user' ? '#ffffff' : '#1f1f1f',
                      padding: '10px 14px',
                      borderRadius: item.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: 13,
                      lineHeight: 1.5
                    }}
                  >
                    {item.text}
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        textAlign: 'right',
                        marginTop: 4
                      }}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
          {isTyping && (
            <div style={{ fontSize: 12, color: '#8c8c8c', fontStyle: 'italic', margin: '8px 0 8px 46px' }}>
              CivicFix AI is typing...
            </div>
          )}
        </div>

        <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
          </Space.Compact>
        </div>
      </div>
    </Drawer>
  );
};

export default AIChatDrawer;

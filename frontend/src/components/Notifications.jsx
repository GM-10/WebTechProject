import React, { useState, useEffect } from 'react';
import { Bell, X, Info, Calendar, Award, AlertCircle } from 'lucide-react';
import io from 'socket.io-client';

import './Notifications.css';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(socketUrl, { autoConnect: false, reconnection: true, reconnectionAttempts: 5 });

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [socketError, setSocketError] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};


  useEffect(() => {
    if (!user.id) return;

    const handleConnect = () => {
      setSocketStatus('connected');
      setSocketError('');
    };

    const handleDisconnect = (reason) => {
      setSocketStatus('disconnected');
      if (reason !== 'io client disconnect') {
        setSocketError('Live notifications are reconnecting.');
      }
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setSocketStatus('error');
      setSocketError('Live notifications are unavailable right now.');
    };

    socket.connect();
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    socket.on('notification', (data) => {
      // Only show if it's for this student or if it's a general broadcast
      if (!data.studentId || data.studentId === user.id) {
        const newNotif = {
          id: Date.now(),
          ...data,
          read: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        if (Notification.permission === 'granted') {
          new Notification('Placement Update', { body: data.message });
        }
      }
    });

    return () => {
      socket.off('notification');
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.disconnect();
    };
  }, [user.id]);


  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'interview_scheduled': return <Calendar size={18} className="notif-icon scheduled" />;
      case 'application_update': return <Info size={18} className="notif-icon update" />;
      case 'offer_received': return <Award size={18} className="notif-icon offer" />;
      default: return <AlertCircle size={18} className="notif-icon alert" />;
    }
  };

  return (
    <div className="notifications-wrapper">
      <button 
        className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown && unreadCount > 0) markAllRead();
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notif-dropdown glass-panel animate-fade-in slide-in">
          <div className="notif-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="clear-all" onClick={() => { setNotifications([]); setUnreadCount(0); }}>Clear All</button>
            )}
          </div>
          {socketError && (
            <div className="notif-empty" style={{ margin: '0 0 12px 0', padding: '10px 12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)' }}>
              <p style={{ margin: 0 }}>{socketError}</p>
              <span style={{ opacity: 0.8 }}>Status: {socketStatus}</span>
            </div>
          )}
          <div className="notif-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                  <div className="notif-main">
                    {getIcon(notif.type)}
                    <div className="notif-content">
                      <p>{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                  <button className="notif-remove" onClick={(e) => removeNotification(e, notif.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="notif-empty">
                <p>No new notifications</p>
                <span>We'll notify you about placement updates here.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

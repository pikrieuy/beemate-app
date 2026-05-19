"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  acceptTeamInvitation,
  rejectTeamInvitation 
} from "@/actions";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface Invitation {
  id: string;
  teamId: string;
  userId: string;
  joinStatus: string;
  createdAt: Date;
  team: {
    id: string;
    name: string;
    description: string | null;
    leader: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

interface NotificationsClientProps {
  notifications: Notification[];
  invitations: Invitation[];
}

export function NotificationsClient({ notifications, invitations }: NotificationsClientProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    router.refresh();
  };

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationAsRead(notificationId);
      router.refresh();
    }
  };

  const handleAcceptInvitation = async (teamId: string) => {
    setProcessing(teamId);
    const result = await acceptTeamInvitation(teamId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  const handleRejectInvitation = async (teamId: string) => {
    setProcessing(teamId);
    const result = await rejectTeamInvitation(teamId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setProcessing(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INVITE':
        return { icon: 'ph-handshake', color: 'var(--bl)' };
      case 'ACCEPT':
        return { icon: 'ph-check-circle', color: 'var(--gn)' };
      case 'ALERT':
        return { icon: 'ph-bell', color: 'var(--ho)' };
      default:
        return { icon: 'ph-info', color: 'var(--t2)' };
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page on" style={{ minHeight: '100vh', padding: '16px 24px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '36px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--t)' }}>
              Notifications
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--t2)', margin: 0 }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              style={{ background: 'transparent', border: 'none', color: 'var(--bl)', fontWeight: 700, cursor: 'pointer' }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
              Team Invitations ({invitations.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {invitations.map((invitation, i) => (
                <motion.div 
                  key={invitation.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--bdr)',
                    borderRadius: '20px',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--ho)' }} />
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      background: 'rgba(245, 166, 35, 0.15)', 
                      color: 'var(--ho)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '24px', 
                      flexShrink: 0 
                    }}>
                      <i className="ph-fill ph-handshake"></i>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--t)', marginBottom: '4px' }}>
                        Team Invitation
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.5, marginBottom: '4px' }}>
                        <strong>{invitation.team.leader.name}</strong> invited you to join <strong>{invitation.team.name}</strong>
                      </div>
                      {invitation.team.description && (
                        <div style={{ fontSize: '13px', color: 'var(--t2)', marginBottom: '16px', fontStyle: 'italic' }}>
                          "{invitation.team.description}"
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          className="btn btn-honey btn-sm"
                          onClick={() => handleAcceptInvitation(invitation.teamId)}
                          disabled={processing === invitation.teamId}
                        >
                          {processing === invitation.teamId ? 'Accepting...' : 'Accept'}
                        </button>
                        <button 
                          className="btn btn-dark btn-sm"
                          onClick={() => handleRejectInvitation(invitation.teamId)}
                          disabled={processing === invitation.teamId}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 ? (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--t)', marginBottom: '16px' }}>
              All Notifications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map((notification, i) => {
                const { icon, color } = getNotificationIcon(notification.type);
                return (
                  <motion.div 
                    key={notification.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    style={{
                      background: notification.isRead ? 'var(--bg)' : 'var(--bg2)',
                      border: '1px solid var(--bdr)',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {!notification.isRead && (
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--bl)' }} />
                    )}
                    
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      background: `${color}15`, 
                      color: color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '24px', 
                      flexShrink: 0 
                    }}>
                      <i className={`ph-fill ${icon}`}></i>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--t)' }}>
                          {notification.type === 'INVITE' && 'Team Invitation'}
                          {notification.type === 'ACCEPT' && 'Invitation Accepted'}
                          {notification.type === 'ALERT' && 'Alert'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--t3)', fontWeight: 600 }}>
                          {getTimeAgo(notification.createdAt)}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.5 }}>
                        {notification.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : invitations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--t2)' }}>
            <i className="ph-fill ph-bell-slash" style={{ fontSize: '64px', marginBottom: '16px', display: 'block', opacity: 0.5 }}></i>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>No notifications yet</p>
            <p style={{ fontSize: '14px' }}>You'll see notifications here when you get team invitations or updates</p>
          </div>
        )}
      </div>
    </div>
  );
}

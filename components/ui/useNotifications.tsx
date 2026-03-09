"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bell, Check, AlertTriangle, Info, X, CheckCircle, XCircle } from "lucide-react";

export interface Notification {
  id: number;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notification")
        .select("*")
        .eq("user_id", user.id)
        .order("is_read", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("notification")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const openNotifications = async () => {
    setIsOpen(true);
    await fetchNotifications();
    await markAllAsRead();
  };

  const closeNotifications = () => {
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    isOpen,
    unreadCount,
    openNotifications,
    closeNotifications,
    fetchNotifications,
  };
}

export function getNotificationIcon(type: string) {
  switch (type) {
    case "order_approved":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "order_rejected":
      return <XCircle className="w-4 h-4 text-error" />;
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    default:
      return <Info className="w-4 h-4 text-info" />;
  }
}

export function formatNotificationTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export function NotificationDropdown({ 
  notifications, 
  loading, 
  isOpen, 
  onClose,
  onMarkAllRead,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-base-200 border border-base-300 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
        <h3 className="font-semibold text-base-content">Notificaciones</h3>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-xs btn-circle cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <span className="loading loading-spinner loading-sm text-primary"></span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-base-content/50">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <ul className="divide-y divide-base-300">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`px-4 py-3 hover:bg-base-300/50 transition-colors cursor-pointer ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? "font-medium" : ""} text-base-content`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      {formatNotificationTime(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-base-300 bg-base-300/30">
          <button
            onClick={onMarkAllRead}
            className="btn btn-ghost btn-sm w-full justify-center text-primary cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Marcar todo como leído
          </button>
        </div>
      )}
    </div>
  );
}

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

export function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="btn btn-ghost btn-circle relative cursor-pointer"
    >
      <div className="indicator">
        <Bell className="size-5 text-base-content/70" />
        {unreadCount > 0 && (
          <span className="indicator-item badge badge-xs badge-primary rounded-full mt-1 mr-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}

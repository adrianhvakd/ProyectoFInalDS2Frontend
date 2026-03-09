"use client";

import { useEffect, useRef } from "react";
import { useNotifications, NotificationDropdown, NotificationBell } from "@/components/ui/useNotifications";

export default function NavbarNotifications() {
  const { notifications, loading, isOpen, unreadCount, openNotifications, closeNotifications, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeNotifications();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBell unreadCount={unreadCount} onClick={openNotifications} />
      <NotificationDropdown 
        notifications={notifications} 
        loading={loading} 
        isOpen={isOpen} 
        onClose={closeNotifications}
        onMarkAllRead={markAllAsRead}
      />
    </div>
  );
}

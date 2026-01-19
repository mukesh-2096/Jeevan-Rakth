import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET - Fetch all notifications for the current user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch all notifications for the user, sorted by most recent first
    const notifications = await Notification.find({ userId: currentUser.id })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 notifications
      .lean();

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      userId: currentUser.id,
      isRead: false,
    });

    // Format notifications for frontend
    const formattedNotifications = notifications.map((notification) => {
      const createdAt = new Date(notification.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = '';
      if (diffMins < 1) {
        timeAgo = 'Just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = createdAt.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }

      return {
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        organizationName: notification.organizationName,
        organizationType: notification.organizationType,
        isRead: notification.isRead,
        timeAgo,
        createdAt: notification.createdAt,
      };
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH - Mark all notifications as read
export async function PATCH() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Mark all user's notifications as read
    await Notification.updateMany(
      { userId: currentUser.id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({
      message: 'All notifications marked as read',
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

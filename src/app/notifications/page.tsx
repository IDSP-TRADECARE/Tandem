'use client';

import { IoIosArrowBack } from 'react-icons/io';
import { IoHourglassOutline, IoCalendarOutline, IoPeopleOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { NotificationItem } from '../components/ui/notifications/NotificationItem';
import { HighlightText } from '../components/ui/notifications/HighlightText';

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      icon: <IoHourglassOutline size={24} />,
      message: (
        <>
          You requested a nanny for <HighlightText>Oct,26</HighlightText> from 7:00AM to 5:00PM
        </>
      ),
      time: '2h',
      onClick: () => console.log('Clicked notification 1'),
    },
    {
      id: 2,
      icon: <IoCalendarOutline size={24} />,
      message: (
        <>
          Your <HighlightText>Oct,26</HighlightText> nanny booking has been approved
        </>
      ),
      time: '5h',
      onClick: () => console.log('Clicked notification 2'),
    },
    {
      id: 3,
      icon: <IoPeopleOutline size={24} />,
      message: (
        <>
          Your <HighlightText>Oct,20</HighlightText> shared nanny has been approved
        </>
      ),
      time: '8h',
      onClick: () => console.log('Clicked notification 3'),
    },
    {
      id: 4,
      icon: <IoChatbubbleOutline size={24} />,
      message: (
        <>
          You've received a message from{' '}
          <HighlightText>Mattheus Walkma</HighlightText>
        </>
      ),
      time: '8h',
      onClick: () => console.log('Clicked notification 4'),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosArrowBack size={28} className="text-gray-900" />
          </button>
          <h1 className="flex-1 text-center text-3xl font-bold text-gray-900 pr-10">
            Notification
          </h1>
        </div>
      </div>

      {/* Notifications List */}
      <div>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            icon={notification.icon}
            message={notification.message}
            time={notification.time}
            onClick={notification.onClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <IoCalendarOutline size={40} className="text-gray-400 py-4 px-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500 text-center">
            When you get notifications, they'll show up here
          </p>
        </div>
      )}
    </div>
  );
}
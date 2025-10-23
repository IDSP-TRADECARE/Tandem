'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from './components/Layout/BottomNav';
import { useRouter } from 'next/navigation';
import { scheduleToTasks, Task } from '../lib/scheduleToTask';

type TaskType = 'all' | 'work' | 'childcare';

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState<TaskType>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch schedules from database
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/schedule/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      
      // Convert schedules to tasks
      const allTasks: Task[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.schedules.forEach((schedule: any) => {
        const scheduleTasks = scheduleToTasks(schedule);
        allTasks.push(...scheduleTasks);
      });

      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.type === filter;
  });

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const getCurrentDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const date = today.getDate();
    
    return `${dayName}, ${monthName} ${date}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0a1628]">Today</h1>
            <p className="text-gray-500 text-sm mt-1">{getCurrentDate()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/calendar')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-6 border-b-2 border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              filter === 'all' ? 'text-[#0a1628]' : 'text-gray-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              All
            </div>
            {filter === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1628]"></div>
            )}
          </button>
          <button
            onClick={() => setFilter('work')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              filter === 'work' ? 'text-[#0a1628]' : 'text-gray-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Work
            </div>
            {filter === 'work' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1628]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks for today</h3>
          <p className="text-gray-600 mb-6">Upload your schedule to see your daily tasks</p>
          <button
            onClick={() => router.push('/schedule/upload')}
            className="px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#2d4a6f] transition-colors"
          >
            Upload Schedule
          </button>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="px-6 py-4 space-y-3">
          {activeTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTaskComplete(task.id)}
              className={`w-full p-4 rounded-2xl transition-all text-left ${
                task.type === 'childcare'
                  ? 'bg-green-50 border-2 border-green-100'
                  : 'bg-blue-50 border-2 border-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${
                  task.type === 'childcare'
                    ? 'border-green-600'
                    : 'border-blue-600'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-[#0a1628] text-base">{task.title}</h3>
                    <span className="text-sm font-medium text-gray-600">{task.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.subtitle}</p>
                  <div className="flex gap-1">
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-[#0a1628] mb-3">COMPLETED</h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTaskComplete(task.id)}
                className={`w-full p-4 rounded-2xl transition-all text-left ${
                  task.type === 'childcare'
                    ? 'bg-green-50 border-2 border-green-100'
                    : 'bg-blue-50 border-2 border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    task.type === 'childcare'
                      ? 'bg-green-600'
                      : 'bg-blue-600'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-[#0a1628] text-base">{task.title}</h3>
                      <span className="text-sm font-medium text-gray-600">{task.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.subtitle}</p>
                    <div className="flex gap-1">
                      <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => router.push('/schedule/upload')}
        className="fixed bottom-32 right-6 w-16 h-16 bg-[#a8d446] rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <BottomNav onUploadClick={() => router.push('/schedule/upload')} />
    </div>
  );
}
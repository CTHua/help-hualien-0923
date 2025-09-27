'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface OnGoing {
  id: number;
  reportId: number;
  userId: string;
  status: string;
  minutes: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userPhone: string;
  user: User;
}

interface MyReport {
  id: number;
  userId: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  onGoings: OnGoing[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MyReportsResponse {
  success: boolean;
  data: MyReport[];
}

interface MyOnGoingReport {
  id: number;
  userId: string;
  name: string;
  phone: string;
  address: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MyOnGoing {
  id: number;
  reportId: number;
  userId: string;
  status: string;
  minutes: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userPhone: string;
  report: MyOnGoingReport;
  user: User;
}

interface MyOnGoingsResponse {
  success: boolean;
  data: MyOnGoing[];
}

export default function Status() {
  const { user, loading, hasProfile, profileLoading } = useAuth();
  const router = useRouter();
  const [myReports, setMyReports] = useState<MyReport[]>([]);
  const [myOngoings, setMyOngoings] = useState<MyOnGoing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOngoingLoading, setIsOngoingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ongoingError, setOngoingError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<MyReport | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    address: '',
    status: '',
    description: ''
  });
  const [isOngoingEditModalOpen, setIsOngoingEditModalOpen] = useState(false);
  const [editingOngoing, setEditingOngoing] = useState<MyOnGoing | null>(null);
  const [isUpdatingOngoing, setIsUpdatingOngoing] = useState(false);
  const [ongoingEditFormData, setOngoingEditFormData] = useState({
    status: '',
    minutes: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && !profileLoading && user && !hasProfile) {
      router.push('/profile');
    }
  }, [user, loading, profileLoading, hasProfile, router]);

  const fetchMyReports = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('https://help-hualien-api.cthua.io/report/my', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('無法獲取我的回報資料');
      }

      const data: MyReportsResponse = await response.json();

      if (data.success) {
        setMyReports(data.data);
      } else {
        throw new Error('API 回應錯誤');
      }
    } catch (error) {
      console.error('獲取我的回報失敗:', error);
      setError('無法載入我的回報資料，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMyOngoings = useCallback(async () => {
    if (!user) return;

    setIsOngoingLoading(true);
    setOngoingError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('https://help-hualien-api.cthua.io/ongoing/my', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('無法獲取我的行程資料');
      }

      const data: MyOnGoingsResponse = await response.json();

      if (data.success) {
        setMyOngoings(data.data);
      } else {
        throw new Error('API 回應錯誤');
      }
    } catch (error) {
      console.error('獲取我的行程失敗:', error);
      setOngoingError('無法載入我的行程資料，請稍後再試');
    } finally {
      setIsOngoingLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyReports();
      fetchMyOngoings();
    }
  }, [user, fetchMyReports, fetchMyOngoings]);

  const openEditModal = (report: MyReport) => {
    setEditingReport(report);
    setEditFormData({
      address: report.address,
      status: report.status,
      description: report.description
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingReport(null);
    setEditFormData({
      address: '',
      status: '',
      description: ''
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport || !user) return;

    setIsUpdating(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch(`https://help-hualien-api.cthua.io/report/${editingReport.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        throw new Error('無法更新案件資料');
      }

      // 更新成功後重新載入資料
      await fetchMyReports();
      closeEditModal();
      alert('案件更新成功！');
    } catch (error) {
      console.error('更新案件失敗:', error);
      alert('更新案件失敗，請稍後再試');
    } finally {
      setIsUpdating(false);
    }
  };

  const openOngoingEditModal = (ongoing: MyOnGoing) => {
    setEditingOngoing(ongoing);
    setOngoingEditFormData({
      status: ongoing.status,
      minutes: ongoing.minutes || 0
    });
    setIsOngoingEditModalOpen(true);
  };

  const closeOngoingEditModal = () => {
    setIsOngoingEditModalOpen(false);
    setEditingOngoing(null);
    setOngoingEditFormData({
      status: '',
      minutes: 0
    });
  };

  const handleOngoingEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOngoingEditFormData(prev => ({
      ...prev,
      [name]: name === 'minutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleUpdateOngoing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOngoing || !user) return;

    setIsUpdatingOngoing(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch(`https://help-hualien-api.cthua.io/ongoing/${editingOngoing.id}/status`, {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ongoingEditFormData)
      });

      
      if (!response.ok) {
        throw new Error('無法更新行程狀態');
      }

      // 更新成功後重新載入資料
      await fetchMyOngoings();
      closeOngoingEditModal();
      alert('行程狀態更新成功！');
    } catch (error) {
      console.error('更新行程狀態失敗:', error);
      alert('更新行程狀態失敗，請稍後再試');
    } finally {
      setIsUpdatingOngoing(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'processing': return '處理中';
      case 'completed': return '已完成';
      case 'rejected': return '已拒絕';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnGoingStatusText = (status: string) => {
    switch (status) {
      case 'on_the_way': return '前往中';
      case 'arrived': return '已到達';
      case 'left': return '已離開';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getOnGoingStatusColor = (status: string) => {
    switch (status) {
      case 'on_the_way': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'left': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首頁
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">我的案件狀態</h1>
              <p className="text-gray-600">查看您提交的回報案件狀態和處理進度</p>
            </div>
            <button
              onClick={() => {
                fetchMyReports();
                fetchMyOngoings();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center sm:w-auto w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新整理
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入案件狀態中...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">載入失敗</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMyReports}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              重試
            </button>
          </div>
        ) : myReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">暫無案件</h3>
            <p className="text-gray-600 mb-4">您尚未提交任何回報案件</p>
            <button
              onClick={() => router.push('/report')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              立即回報
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        回報編號: #{report.id}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)} inline-block w-fit`}>
                          {getStatusText(report.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          提交時間: {formatDate(report.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditModal(report)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:w-auto w-full sm:flex-shrink-0"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      編輯
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">地址</h4>
                    <p className="text-gray-900">{report.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">聯絡電話</h4>
                    <p className="text-gray-900">{report.phone}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">詳細描述</h4>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{report.description}</p>
                </div>

                {report.onGoings && report.onGoings.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      處理進度
                    </h4>
                    <div className="space-y-3">
                      {report.onGoings.map((ongoing) => (
                        <div key={ongoing.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOnGoingStatusColor(ongoing.status)}`}>
                                {getOnGoingStatusText(ongoing.status)}
                              </span>
                              {ongoing.minutes && ongoing.status === 'on_the_way' && (
                                <span className="text-sm text-blue-600 font-medium">
                                  預計 {ongoing.minutes} 分鐘後到達
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(ongoing.createdAt)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <p><span className="font-medium">處理人員:</span> {ongoing.userName}</p>
                            <p><span className="font-medium">聯絡電話:</span> {ongoing.userPhone}</p>
                          </div>
                          {ongoing.updatedAt !== ongoing.createdAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              最後更新: {formatDate(ongoing.updatedAt)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!report.onGoings || report.onGoings.length === 0) && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium">等待處理</p>
                          <p>您的案件正在等待處理人員接收，我們會盡快為您安排。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {report.updatedAt !== report.createdAt && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      案件最後更新: {formatDate(report.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 我的行程區塊 */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              我的行程
            </h2>
            <p className="text-gray-600">查看您正在前往處理的案件</p>
          </div>

          {isOngoingLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">載入行程資料中...</p>
            </div>
          ) : ongoingError ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">載入失敗</h3>
              <p className="text-gray-600 mb-4">{ongoingError}</p>
              <button
                onClick={fetchMyOngoings}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                重試
              </button>
            </div>
          ) : myOngoings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暫無進行中的行程</h3>
              <p className="text-gray-600">您目前沒有正在前往處理的案件</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOngoings.map((ongoing) => (
                <div key={ongoing.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          前往案件 #{ongoing.report.id}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOnGoingStatusColor(ongoing.status)} inline-block w-fit`}>
                            {getOnGoingStatusText(ongoing.status)}
                          </span>
                          {ongoing.minutes && ongoing.status === 'on_the_way' && (
                            <span className="text-sm text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full inline-block w-fit">
                              預計 {ongoing.minutes} 分鐘後到達
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 block sm:hidden">
                          開始時間: {formatDate(ongoing.createdAt)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-sm text-gray-500 hidden sm:block">
                          開始時間: {formatDate(ongoing.createdAt)}
                        </span>
                        <button
                          onClick={() => openOngoingEditModal(ongoing)}
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm sm:w-auto w-full sm:flex-shrink-0"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          編輯
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      目標地點資訊
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">地址</p>
                        <p className="text-gray-900">{ongoing.report.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">聯絡人</p>
                        <p className="text-gray-900">{ongoing.report.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">聯絡電話</p>
                        <p className="text-gray-900">{ongoing.report.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">案件狀態</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ongoing.report.status)}`}>
                          {getStatusText(ongoing.report.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">案件描述</h4>
                    <p className="text-gray-900 bg-white p-3 rounded-lg border">{ongoing.report.description}</p>
                  </div>

                  {ongoing.updatedAt !== ongoing.createdAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        行程最後更新: {formatDate(ongoing.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 編輯案件 Modal */}
      {isEditModalOpen && editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  編輯案件 #{editingReport.id}
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateReport} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                  地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="請輸入詳細地址"
                />
              </div>

              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                  案件狀態 <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value="pending">待處理</option>
                  <option value="processing">處理中</option>
                  <option value="completed">已完成</option>
                  <option value="rejected">已拒絕</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                  詳細描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-vertical"
                  placeholder="請詳細描述需要協助的事項、情況說明等"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">編輯說明：</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>修改地址時請確保地址正確完整</li>
                      <li>狀態變更會影響案件的處理流程</li>
                      <li>描述內容會影響處理人員的判斷</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      更新中...
                    </>
                  ) : (
                    '保存變更'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 編輯行程狀態 Modal */}
      {isOngoingEditModalOpen && editingOngoing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  編輯行程狀態 - 案件 #{editingOngoing.report.id}
                </h3>
                <button
                  onClick={closeOngoingEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateOngoing} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="ongoing-status" className="block text-sm font-medium text-gray-700 mb-2">
                  行程狀態 <span className="text-red-500">*</span>
                </label>
                <select
                  id="ongoing-status"
                  name="status"
                  value={ongoingEditFormData.status}
                  onChange={handleOngoingEditFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value="on_the_way">前往中</option>
                  <option value="arrived">已到達</option>
                  <option value="left">已離開</option>
                </select>
              </div>

              <div>
                <label htmlFor="ongoing-minutes" className="block text-sm font-medium text-gray-700 mb-2">
                  預計到達時間（分鐘）
                </label>
                <input
                  type="number"
                  id="ongoing-minutes"
                  name="minutes"
                  value={ongoingEditFormData.minutes}
                  onChange={handleOngoingEditFormChange}
                  min="0"
                  max="999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="輸入預計到達時間（僅適用於前往中狀態）"
                />
                <p className="mt-1 text-sm text-gray-500">
                  預計到達時間僅在「前往中」狀態時顯示，設為 0 表示不顯示預計時間
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">狀態說明：</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>前往中：</strong>正在前往目標地點</li>
                      <li><strong>已到達：</strong>已到達目標地點，開始處理</li>
                      <li><strong>已離開：</strong>處理完成，已離開現場</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeOngoingEditModal}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingOngoing}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {isUpdatingOngoing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      更新中...
                    </>
                  ) : (
                    '更新狀態'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
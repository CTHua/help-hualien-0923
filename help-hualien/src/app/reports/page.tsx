'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface OnGoing {
  id: number;
  reportId: number;
  userId: string;
  minutes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Report {
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
  onGoingCount: number;
  arrivedCount: number;
  leftCount: number;
}

interface ApiResponse {
  success: boolean;
  data: Report[];
}

export default function Reports() {
  const { user, loading, hasProfile, profileLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ongoingReports, setOngoingReports] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');

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

  const fetchReports = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('https://help-hualien-api.cthua.io/report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('無法獲取回報資料');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setReports(data.data);
      } else {
        throw new Error('API 回應錯誤');
      }
    } catch (error) {
      console.error('獲取回報失敗:', error);
      setError('無法載入回報資料，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, fetchReports]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (reportId: number) => {
    setSelectedReportId(reportId);
    setEstimatedMinutes('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReportId(null);
    setEstimatedMinutes('');
  };

  const reportOngoing = async () => {
    if (!user || !selectedReportId || !estimatedMinutes || ongoingReports.has(selectedReportId)) return;

    const minutes = parseInt(estimatedMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      alert('請輸入有效的時間（分鐘）');
      return;
    }

    try {
      setOngoingReports(prev => new Set(prev).add(selectedReportId));

      const token = await user.getIdToken();
      const response = await fetch('https://help-hualien-api.cthua.io/ongoing', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reportId: selectedReportId,
          minutes: minutes
        })
      });

      if (!response.ok) {
        throw new Error('回報前往失敗');
      }

      // 跳轉到狀態頁面
      router.push('/status');

      // 重新獲取報告列表以更新狀態
      await fetchReports();
      closeModal();

    } catch (error) {
      console.error('回報前往失敗:', error);
      setOngoingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedReportId);
        return newSet;
      });
      alert('回報前往失敗，請稍後再試');
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">回報單列表</h1>
              <p className="text-gray-600">查看所有回報案件的狀態</p>
            </div>
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入回報資料中...</p>
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
              onClick={fetchReports}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重試
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">暫無回報資料</h3>
            <p className="text-gray-600 mb-4">目前沒有任何回報案件</p>
            <button
              onClick={() => router.push('/report')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              立即回報
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      回報編號: #{report.id}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">聯絡人</h4>
                    <p className="text-gray-900">{report.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">聯絡電話</h4>
                    <p className="text-gray-900">{report.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">地址</h4>
                    <p className="text-gray-900">{report.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">處理狀態</h4>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-blue-600">前往中: {report.onGoingCount}</span>
                      <span className="text-green-600">已到達: {report.arrivedCount}</span>
                      <span className="text-gray-600">已離開: {report.leftCount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">詳細描述</h4>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{report.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      {report.updatedAt !== report.createdAt && (
                        <p className="text-sm text-gray-500">
                          最後更新: {formatDate(report.updatedAt)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openModal(report.id)}
                      disabled={ongoingReports.has(report.id) || report.status === 'completed'}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                        ongoingReports.has(report.id) || report.status === 'completed'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {ongoingReports.has(report.id) ? '已回報前往' : '回報前往'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for estimated arrival time */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">回報前往</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  請輸入您預計抵達現場需要的時間（分鐘）：
                </p>
                <div className="relative">
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                    placeholder="例如：15"
                    min="1"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">分鐘</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  建議填寫 5-60 分鐘內的合理時間
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={reportOngoing}
                  disabled={!estimatedMinutes || parseInt(estimatedMinutes) <= 0}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    !estimatedMinutes || parseInt(estimatedMinutes) <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  確認回報
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
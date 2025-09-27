'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Report() {
  const { user, loading, hasProfile, profileLoading, userProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    description: ''
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name,
        phone: userProfile.phone
      }));
    }
  }, [userProfile]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('您的瀏覽器不支援地理定位功能');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('獲取位置失敗:', error);
        setIsGettingLocation(false);
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '使用者拒絕了地理定位請求。請在瀏覽器設定中允許位置存取權限。';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置訊息不可用。請確保您的裝置支援GPS定位，或嘗試移動到空曠的地方。';
            break;
          case error.TIMEOUT:
            errorMessage = '定位請求超時。請檢查網路連線並重新嘗試。';
            break;
          default:
            errorMessage = '獲取位置時發生未知錯誤。請確保您的裝置支援定位功能並已開啟GPS。';
            break;
        }
        alert(`無法獲取您的位置: ${errorMessage}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分鐘內的快取位置可接受
      }
    );
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 這裡可以添加提交到資料庫的邏輯
      console.log('受災戶回報資料:', {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
      });

      const token = await user.getIdToken();

      const reportData: any = {
        address: formData.address,
        description: formData.description
      };

      // 如果有GPS位置，加入到請求中
      if (location) {
        reportData.latitude = location.latitude;
        reportData.longitude = location.longitude;
      }

      await fetch('https://help-hualien-api.cthua.io/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      alert('回報已成功提交！我們會盡快處理您的案件。');
      // 跳轉到回報單列表
      router.push('/reports');
      // 重置表單
      setFormData({
        name: '',
        phone: '',
        address: '',
        description: ''
      });
    } catch (error) {
      console.error('提交失敗:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">受災戶回報</h1>
          <p className="text-gray-600">請填寫以下資訊，我們會儘速為您處理</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="請輸入您的姓名"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="請輸入聯絡電話"
              />
              <p className="mt-1 text-sm text-gray-500">
                聯絡資訊已從您的個人資料自動填入
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">聯絡資訊說明：</p>
                <p>姓名和電話已從您的個人資料自動填入。如需修改，請前往
                  <button
                    onClick={() => router.push('/profile')}
                    className="text-blue-700 underline hover:text-blue-800 mx-1"
                  >
                    個人資料頁面
                  </button>
                  進行更新。
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              地址 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="請輸入詳細地址"
            />

            <div className="mt-3 flex flex-col space-y-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isGettingLocation ? '定位中...' : '獲取GPS位置（可選）'}
              </button>

              {location && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-sm text-green-800">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    GPS位置已獲取
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    緯度: {location.latitude.toFixed(6)}, 經度: {location.longitude.toFixed(6)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation(null)}
                    className="text-xs text-green-600 hover:text-green-800 underline mt-1"
                  >
                    移除GPS位置
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              詳細描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-vertical"
              placeholder="請詳細描述需要協助的事項、情況說明等"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">重要提醒：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>如遇緊急狀況請立即撥打119或110</li>
                  <li>請確保個人安全後再進行回報</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : '提交回報'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
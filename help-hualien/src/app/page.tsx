'use client';

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, hasProfile, profileLoading, logout } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full sm:w-12 sm:h-12"
                />
              )}
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                  歡迎，{user.displayName}！
                </h1>
                <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => router.push('/profile')}
                className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                個人資料
              </button>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                登出
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">受災戶回報</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              快速回報災害情況，我們會立即為您處理。
            </p>
            <button
              onClick={() => router.push('/report')}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              立即回報
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">回報單列表</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              查看所有回報案件的狀態和處理進度。
            </p>
            <button
              onClick={() => router.push('/reports')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              查看回報
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">案件狀態</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              查看您回報案件的處理進度。
            </p>
            <button
              onClick={() => router.push('/status')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              查看狀態
            </button>
          </div>

          {/* <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">幫助中心</h2>
            </div>
            <p className="text-gray-600 mb-4">
              獲取使用指南和常見問題解答。
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              獲取幫助
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

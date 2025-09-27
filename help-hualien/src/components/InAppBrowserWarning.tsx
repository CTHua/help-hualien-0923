'use client';

import { useState, useEffect } from 'react';
import { isInAppBrowser, getInAppBrowserType } from '../utils/browserDetection';

export default function InAppBrowserWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [browserType, setBrowserType] = useState<string | null>(null);

  useEffect(() => {
    const isInApp = isInAppBrowser();
    const appType = getInAppBrowserType();

    setShowWarning(isInApp);
    setBrowserType(appType);
  }, []);

  const handleOpenInBrowser = () => {
    // 複製當前 URL 到剪貼板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* 警告圖標 */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            需要使用外部瀏覽器
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            偵測到您正在使用 {browserType} 的內建瀏覽器。為了確保 Google 登入功能正常運作，請使用外部瀏覽器（如 Safari、Chrome）開啟此頁面。
          </p>

          <div className="space-y-3">
            {/* iOS 指引 */}
            <div className="text-xs text-gray-500 text-left bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">📱 iOS 用戶：</p>
              <p>點擊右上角「⋯」→「在 Safari 中打開」</p>
            </div>

            {/* Android 指引 */}
            <div className="text-xs text-gray-500 text-left bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">🤖 Android 用戶：</p>
              <p>點擊右上角「⋯」→「在瀏覽器中打開」</p>
            </div>

            <button
              onClick={handleOpenInBrowser}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              📋 複製網址
            </button>

            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              我知道了，繼續使用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
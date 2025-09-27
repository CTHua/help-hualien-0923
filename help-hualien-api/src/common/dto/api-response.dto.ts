
export interface ApiResponse<T> {
  /**
   * 表示請求是否成功
   */
  success: boolean;

  /**
   * 成功時所攜帶的資料 (可選)
   */
  data?: T;

  /**
   * 失敗時的錯誤資訊 (可選)
   */
  error?: {
    /**
     * HTTP 狀態碼（字串形式）或自訂錯誤碼
     */
    code?: string;
    /**
     * 開發者或使用者可讀的錯誤訊息
     */
    message: string;
  };
}

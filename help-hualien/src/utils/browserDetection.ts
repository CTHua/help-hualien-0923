/**
 * 檢測是否在內嵌瀏覽器中運行
 * 包含 LINE、Facebook、Instagram、Threads、WeChat 等常見的內嵌瀏覽器
 */
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();

  // 檢測各種內嵌瀏覽器的 User-Agent 特徵
  const inAppPatterns = [
    'line/', // LINE
    'fban', // Facebook App
    'fbav', // Facebook App
    'instagram', // Instagram
    'threads', // Threads
    'micromessenger', // WeChat
    'qq/', // QQ
    'twitter', // Twitter/X
    'tiktok', // TikTok
    'snapchat', // Snapchat
    'whatsapp', // WhatsApp
    'telegram', // Telegram
    'discord', // Discord
  ];

  return inAppPatterns.some(pattern => userAgent.includes(pattern));
}

/**
 * 獲取當前內嵌瀏覽器的類型
 */
export function getInAppBrowserType(): string | null {
  if (typeof window === 'undefined') return null;

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('line/')) return 'LINE';
  if (userAgent.includes('fban') || userAgent.includes('fbav')) return 'Facebook';
  if (userAgent.includes('instagram')) return 'Instagram';
  if (userAgent.includes('barcelona')) return 'Threads';
  if (userAgent.includes('micromessenger')) return 'WeChat';
  if (userAgent.includes('qq/')) return 'QQ';
  if (userAgent.includes('twitter')) return 'Twitter';
  if (userAgent.includes('tiktok')) return 'TikTok';
  if (userAgent.includes('snapchat')) return 'Snapchat';
  if (userAgent.includes('whatsapp')) return 'WhatsApp';
  if (userAgent.includes('telegram')) return 'Telegram';
  if (userAgent.includes('discord')) return 'Discord';

  return null;
}
const LOG_KEY = 'clientLogs';
const MAX_LOGS = 500; // 저장할 로그 개수 제한 (성능 보호)

const logBuffer = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');

const persistLogs = () => {
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.splice(0, logBuffer.length - MAX_LOGS); // 오래된 로그 제거
  }
  localStorage.setItem(LOG_KEY, JSON.stringify(logBuffer));
};

// 로그 조회 함수 (필요 시)
export const getClientLogs = () => [...logBuffer];

// 로그 자동 수집
['log', 'warn', 'error'].forEach((level) => {
  const original = console[level];

  console[level] = function (...args) {
    const entry = {
      level,
      message: args.map(a => a?.toString()).join(' '),
      timestamp: new Date().toISOString()
    };

    logBuffer.push(entry);
    persistLogs(); // localStorage에 저장

    original.apply(console, args); // 원래 콘솔 출력도 계속됨
  };
});

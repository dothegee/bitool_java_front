export const sendLogToServer = async ({ level = 'info', message, meta = {} }) => {
    try {
      await fetch('/api/front-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message,
          meta,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn("❌ 서버 로그 전송 실패", err);
    }
  };
  
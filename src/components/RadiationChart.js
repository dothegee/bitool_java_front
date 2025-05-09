// // src/components/RadiationChart.js
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import api from '../services/api';
// import 'chart.js/auto';

// const RadiationChart = () => {
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const end = new Date();
//       const start = new Date(end);
//       start.setHours(start.getHours() - 1000); // 지난 1시간 데이터

//       try {
//         const res = await api.get('/radiation-activity', {
//           params: {
//             start: start.toISOString(),
//             end: end.toISOString()
//           }
//         });

//         const labels = res.data.data.map(d => new Date(d.datetime).toLocaleTimeString());
//         const values = res.data.data.map(d => d.calculatedact);

//         setChartData({
//           labels,
//           datasets: [{
//             label: '감쇠량 (calculatedact)',
//             data: values,
//             borderColor: 'rgba(75,192,192,1)',
//             tension: 0.3,
//           }]
//         });
//       } catch (err) {
//         console.error('데이터 불러오기 실패:', err);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!chartData) return <div>📡 로딩 중...</div>;

//   return (
//     <div style={{ width: '90%', margin: '0 auto' }}>
//       <h3>📈 시간별 방사능 감쇠량</h3>
//       <Line data={chartData} />
//     </div>
//   );
// };

// export default RadiationChart;

// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import api from '../services/api';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'chart.js/auto';

// const RadiationChart = () => {
//   const [chartData, setChartData] = useState(null);
//   const [start, setStart] = useState(new Date(new Date().setHours(new Date().getHours() - 1)));
//   const [end, setEnd] = useState(new Date());

//   const fetchData = async () => {
//     try {
//       const res = await api.get('/radiation-activity', {
//         params: {
//           start: start.toISOString(),
//           end: end.toISOString()
//         }
//       });

//       const labels = res.data.data.map(d => new Date(d.datetime).toLocaleTimeString());
//       const values = res.data.data.map(d => d.calculatedact);

//       setChartData({
//         labels,
//         datasets: [{
//           label: '감쇠량 (calculatedact)',
//           data: values,
//           borderColor: 'rgba(75,192,192,1)',
//           tension: 0.3,
//         }]
//       });
//     } catch (err) {
//       console.error('데이터 불러오기 실패:', err);
//     }
//   };

//   // 날짜 바뀔 때마다 fetch
//   useEffect(() => {
//     fetchData();
//   }, [start, end]);

//   return (
//     <div style={{ width: '90%', margin: '0 auto' }}>
//       <h3>📅 날짜 선택</h3>
//       <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
//         <label>Start:</label>
//         <DatePicker
//           selected={start}
//           onChange={(date) => setStart(date)}
//           showTimeSelect
//           timeFormat="HH:mm"
//           dateFormat="yyyy-MM-dd HH:mm"
//         />
//         <label>End:</label>
//         <DatePicker
//           selected={end}
//           onChange={(date) => setEnd(date)}
//           showTimeSelect
//           timeFormat="HH:mm"
//           dateFormat="yyyy-MM-dd HH:mm"
//         />
//       </div>

//       <h3>📈 방사능 감쇠량 그래프</h3>
//       {chartData ? <Line data={chartData} /> : <div>📡 로딩 중...</div>}
//     </div>
//   );
// };

// export default RadiationChart;


// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import api from '../services/api';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'chart.js/auto';

// const RadiationChart = () => {
//   const [chartData, setChartData] = useState(null);
//   const [start, setStart] = useState(new Date(new Date().setHours(new Date().getHours() - 1)));
//   const [end, setEnd] = useState(new Date());

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("📅 선택된 시작:", start.toISOString());
//         console.log("📅 선택된 종료:", end.toISOString());

//         const res = await api.get('/radiation-activity', {
//           params: {
//             start: start.toISOString(),
//             end: end.toISOString()
//           }
//         });

//         console.log("📡 응답 결과:", res.data);

//         const raw = res.data?.data || [];
//         const labels = raw.map(d => {
//           const date = new Date(d.datetime);
//           console.log("🕐 datetime:", d.datetime, "→", date.toString());
//           return date.toLocaleTimeString();
//         });
//         const values = raw.map(d => d.calculatedact);

//         console.log("📊 labels:", labels);
//         console.log("📊 values:", values);

//         setChartData({
//           labels,
//           datasets: [{
//             label: '감쇠량 (calculatedact)',
//             data: values,
//             borderColor: 'rgba(75,192,192,1)',
//             tension: 0.3,
//             fill: false,
//           }]
//         });
//       } catch (err) {
//         console.error('❌ 데이터 불러오기 실패:', err);
//         setChartData(null);
//       }
//     };

//     fetchData();
//   }, [start, end]);

//   return (
//     <div style={{ width: '90%', margin: '0 auto' }}>
//       <h3>📅 날짜/시간 선택</h3>
//       <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
//         <label>Start:</label>
//         <DatePicker
//           selected={start}
//           onChange={(date) => setStart(date)}
//           showTimeSelect
//           timeFormat="HH:mm"
//           dateFormat="yyyy-MM-dd HH:mm"
//         />
//         <label>End:</label>
//         <DatePicker
//           selected={end}
//           onChange={(date) => setEnd(date)}
//           showTimeSelect
//           timeFormat="HH:mm"
//           dateFormat="yyyy-MM-dd HH:mm"
//         />
//       </div>

//       <h3>📈 방사능 감쇠량 그래프</h3>
//       {chartData && chartData.labels.length > 0 ? (
//         <Line data={chartData} />
//       ) : (
//         <div>📡 데이터가 없습니다. 날짜를 변경해보세요.</div>
//       )}
//     </div>
//   );
// };

// export default RadiationChart;
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // 📊 Chart.js의 Line 그래프 컴포넌트
import api from '../services/api'; // 📡 백엔드 요청용 Axios 인스턴스
import DatePicker from 'react-datepicker'; // 📆 날짜/시간 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // 📆 DatePicker 스타일
import 'chart.js/auto'; // 📊 Chart.js 기본 구성요소 자동 등록
import 'chartjs-adapter-date-fns'; // 📅 Chart.js가 날짜/시간 축을 해석하도록 해주는 어댑터

const RadiationChart = () => {
  // ⏱️ 날짜 범위 상태 (최근 1시간 ~ 현재)
  const [start, setStart] = useState(new Date(new Date().setHours(new Date().getHours() - 1)));
  const [end, setEnd] = useState(new Date());
  
  // 📈 Chart.js에 전달할 데이터 상태
  const [chartData, setChartData] = useState(null);

  // 📡 날짜가 변경될 때마다 백엔드 API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📅 선택된 시작:", start.toISOString());
        console.log("📅 선택된 종료:", end.toISOString());

        // 📡 백엔드 API 호출 (query params로 start~end 전달)
        const res = await api.get('/radiation-activity', {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });

        const raw = res.data?.data || [];

        // ✅ Chart.js 시간 축을 위한 데이터 포맷: [{x: Date, y: Number}]
        const dataPoints = raw.map(d => ({
          x: new Date(d.datetime),         // ⏰ 날짜값 (x축)
          y: d.calculatedact               // 📏 감쇠량 (y축)
        }));

        console.log("📊 dataPoints:", dataPoints);

        // ✅ Chart.js에 넘길 데이터 구조: datasets 배열 (labels 제거)
        setChartData({
          datasets: [{
            label: '감쇠량 (calculatedact)',
            data: dataPoints,
            borderColor: 'rgba(75,192,192,1)', // 선 색
            tension: 0.3,                     // 선 곡률
            pointRadius: 2,                   // 점 크기
            fill: false                       // 배경 없음
          }]
        });
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패:', err);
        setChartData(null);
      }
    };

    fetchData();
  }, [start, end]); // 📌 start 또는 end가 바뀌면 다시 fetch

  // ⚙️ Chart.js 시간 축을 위한 옵션
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time', // 📅 시간 축으로 설정 (중요!)
        time: {
          unit: 'day', // x축 눈금 간격 단위 (분/시/일 중 선택 가능)
          tooltipFormat: 'yyyy-MM-dd HH:mm', // 툴팁에 보이는 날짜 포맷
          displayFormats: {
            hour: 'yyyy-MM-dd HH:mm' // x축에 표시될 날짜 형식
          }
        },
        title: {
          display: true,
          text: '날짜/시간'
        }
      },
      y: {
        title: {
          display: true,
          text: '감쇠량'
        }
      }
    }
  };

  // 🖥️ 화면 출력
  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h3>📅 날짜/시간 선택</h3>

      {/* 📅 DatePicker (날짜/시간 선택용) */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <label>Start:</label>
        <DatePicker
          selected={start}
          onChange={(date) => setStart(date)}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="yyyy-MM-dd HH:mm"
        />
        <label>End:</label>
        <DatePicker
          selected={end}
          onChange={(date) => setEnd(date)}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="yyyy-MM-dd HH:mm"
        />
      </div>

      {/* 📊 라인 그래프 */}
      <h3>📈 방사능 감쇠량 그래프</h3>
      {chartData && chartData.datasets[0].data.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div>📡 데이터가 없습니다. 날짜를 변경해보세요.</div>
      )}
    </div>
  );
};

export default RadiationChart;

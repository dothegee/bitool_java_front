// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2'; // 📊 Chart.js의 Line 그래프 컴포넌트
// import api from '../services/api'; // 📡 백엔드 요청용 Axios 인스턴스
// import DatePicker from 'react-datepicker'; // 📆 날짜/시간 선택 컴포넌트
// import 'react-datepicker/dist/react-datepicker.css'; // 📆 DatePicker 스타일
// import 'chart.js/auto'; // 📊 Chart.js 기본 구성요소 자동 등록
// import 'chartjs-adapter-date-fns'; // 📅 Chart.js가 날짜/시간 축을 해석하도록 해주는 어댑터

// const RadiationChart = () => {
//   // ⏱️ 날짜 범위 상태 (최근 1시간 ~ 현재)
//   const [start, setStart] = useState(new Date(new Date().setHours(new Date().getHours() - 1)));
//   const [end, setEnd] = useState(new Date());
  
//   // 📈 Chart.js에 전달할 데이터 상태
//   const [chartData, setChartData] = useState(null);

//   // 📡 날짜가 변경될 때마다 백엔드 API 호출
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("📅 선택된 시작:", start.toISOString());
//         console.log("📅 선택된 종료:", end.toISOString());

//         // 📡 백엔드 API 호출 (query params로 start~end 전달)
//         const res = await api.get('/radiation-activity', {
//           params: {
//             start: start.toISOString(),
//             end: end.toISOString()
//           }
//         });

//         const raw = res.data?.data || [];

//         // ✅ Chart.js 시간 축을 위한 데이터 포맷: [{x: Date, y: Number}]
//         const dataPoints = raw.map(d => ({
//           x: new Date(d.datetime),         // ⏰ 날짜값 (x축)
//           y: d.calculatedact               // 📏 감쇠량 (y축)
//         }));

//         console.log("📊 dataPoints:", dataPoints);

//         // ✅ Chart.js에 넘길 데이터 구조: datasets 배열 (labels 제거)
//         setChartData({
//           datasets: [{
//             label: '감쇠량 (calculatedact)',
//             data: dataPoints,
//             borderColor: 'rgba(75,192,192,1)', // 선 색
//             tension: 0.3,                     // 선 곡률
//             pointRadius: 2,                   // 점 크기
//             fill: false                       // 배경 없음
//           }]
//         });
//       } catch (err) {
//         console.error('❌ 데이터 불러오기 실패:', err);
//         setChartData(null);
//       }
//     };

//     fetchData();
//   }, [start, end]); // 📌 start 또는 end가 바뀌면 다시 fetch

//   // ⚙️ Chart.js 시간 축을 위한 옵션
//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         type: 'time', // 📅 시간 축으로 설정 (중요!)
//         time: {
//           unit: 'day', // x축 눈금 간격 단위 (분/시/일 중 선택 가능)
//           tooltipFormat: 'yyyy-MM-dd HH:mm', // 툴팁에 보이는 날짜 포맷
//           displayFormats: {
//             hour: 'yyyy-MM-dd HH:mm' // x축에 표시될 날짜 형식
//           }
//         },
//         title: {
//           display: true,
//           text: '날짜/시간'
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: '감쇠량'
//         }
//       }
//     }
//   };

//   // 🖥️ 화면 출력
//   return (
//     <div style={{ width: '90%', margin: '0 auto' }}>
//       <h3>📅 날짜/시간 선택</h3>

//       {/* 📅 DatePicker (날짜/시간 선택용) */}
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

//       {/* 📊 라인 그래프 */}
//       <h3>📈 방사능 감쇠량 그래프</h3>
//       {chartData && chartData.datasets[0].data.length > 0 ? (
//         <Line data={chartData} options={chartOptions} />
//       ) : (
//         <div>📡 데이터가 없습니다. 날짜를 변경해보세요.</div>
//       )}
//     </div>
//   );
// };

// export default RadiationChart;
// ✅ 필요한 라이브러리와 모듈 불러오기
import React, { useEffect, useState } from 'react';               // React Hook 사용
import { Line } from 'react-chartjs-2';                          // Chart.js의 라인 차트 컴포넌트
import api from '../services/api';                               // 백엔드 API 호출용 Axios 인스턴스
import DatePicker from 'react-datepicker';                       // 날짜 선택용 컴포넌트
import 'chart.js/auto';                                          // Chart.js의 모든 구성요소 자동 등록
import 'chartjs-adapter-date-fns';                               // 날짜 포맷 지원 (Chart.js 시간 축용)
import 'react-datepicker/dist/react-datepicker.css';             // DatePicker 기본 스타일

import annotationPlugin from 'chartjs-plugin-annotation'; // threshold 날짜선 표시를 위해
import { Chart } from 'chart.js';

import { sendLogToServer } from '../utils/logUtils'; // 🔥 먼저 import 해줘야 함


Chart.register(annotationPlugin); // 🔥 애노테이션 기능을 Chart.js에 등록

// ✅ 방사선 감쇠량 시각화 컴포넌트 정의
const RadiationChart = () => {
  // 📅 날짜 범위 상태 초기화: 기본값은 100일 전 ~ 오늘
  const [start, setStart] = useState(new Date(new Date().setDate(new Date().getDate() - 400)));
  const [end, setEnd] = useState(new Date());


  // ⏳ 사용자가 선택한 지속시간 필터 ('all' | number | 'null')
  const [selectedDuration, setSelectedDuration] = useState('all');

  // ⏱️ 데이터에서 추출된 고유한 duration 값 목록 (필터 드롭다운용)
  const [durationList, setDurationList] = useState([]);



  // 📈 Chart.js 데이터 상태
  const [chartData, setChartData] = useState(null);

  // 📋 원본 데이터 저장 (duration 등 툴팁에 쓰기 위함)
  const [rawData, setRawData] = useState([]);

  // 📡 날짜 범위 변경 or duration 선택 시 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
              // ✅ 로그 전송: RadiationChart 조회 시작
        await sendLogToServer({
            level: 'info',
            message: 'RadiationChart 데이터 요청',
            meta: {
            start: start.toISOString(),
            end: end.toISOString(),
            selectedDuration
            }
        });

        // 백엔드에서 데이터 조회 (start~end 범위로 쿼리 전달)
        const res = await api.get('/radiation-activity', {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });

        // 응답 받은 데이터 추출 (예: datetime, calculatedact, guide_activity 등 포함)
        const raw = res.data?.data || [];



        
        setRawData(raw); // duration 툴팁용으로 저장

        // 🗂️ duration 값이 있는 항목에서 고유값만 추출하여 드롭다운 구성
        const uniqueDurations = Array.from(
            new Set(raw.map(r => r.duration).filter(d => d != null))
          ).sort((a, b) => a - b); // 숫자 정렬
          setDurationList(uniqueDurations);
  

        // 🔎 선택된 duration 값에 따라 데이터 필터링
        let filtered = [...raw]; // 전체 복사

        if (selectedDuration !== 'all') {
          if (selectedDuration === 'null') {
            filtered = raw.filter(d => d.duration == null); // duration이 null인 항목만
          } else {
            filtered = raw.filter(d => d.duration === Number(selectedDuration)); // 정확히 일치하는 지속시간
          }
        }
        //////////////////////
        // guide_activity ≥ 4 조건에 맞는 날짜 추출
        const markerDate = filtered.find(d => d.guide_activity <= 4)?.datetime;



        // 특정 키를 기반으로 x, y 데이터 구성 (Chart.js 형식에 맞춤)
        const toXY = (key) =>
            filtered.map(d => ({
            x: new Date(d.datetime),      // X축: 시간
            y: d[key] ?? null             // Y축: 측정값 (null이면 표시 안 됨)
          }));

        // Chart.js에 전달할 datasets 구성
        setChartData({
          datasets: [
            {
            //   label: '감쇠량 (calculatedact)',           // 실측 감쇠량
            //   data: toXY('calculatedact'),
            //   borderColor: 'rgba(75,192,192,1)',         // 파란 선
            // //   tension: 0.3,                              // 곡선 정도
            //   pointRadius: 3.5,                             // 점 크기
            //   pointStyle: 'circle',
            //   pointBackgroundColor : 'rgba(75,192,192,1)', 
            //   pointBorderWidth: 1,
            //   showLine: false // ✅ 이 줄을 추가해서 선 제거
            //     // // 🎨 점 색상: duration 값에 따라 다르게 표현
            //     // pointBackgroundColor: filtered.map(d =>
            //     // d.duration == null ? 'gray' :     // 미기재 → 회색
            //     // d.duration === 1 ? 'blue' :       // 1일 → 파란색
            //     // 'red'                             // 나머지 → 빨간색
            //     // )
                label: '감쇠량 (calculatedact)',           // 실측 감쇠량
                data: toXY('calculatedact'),
                showLine: false,                           // 선 제거 → 점만
                pointRadius: 3.5,
                pointStyle: 'circle',
                pointBorderWidth: 1,
            
                // ✅ 조건에 따라 점 색상 다르게 지정
                pointBackgroundColor: filtered.map(d => {
                if (d.calculatedact > d.upper_limit || d.calculatedact < d.lower_limit) {
                    return 'red'; // ❗ 허용 범위 초과 → 빨간 점
                }
                return 'rgba(75,192,192,1)'; // ✅ 정상값 → 기존 파란색 유지
                }),
            
                pointBorderColor: filtered.map(d => {
                if (d.calculatedact > d.upper_limit || d.calculatedact < d.lower_limit) {
                    return 'red'; // ❗ 허용 범위 초과 → 빨간 외곽
                }
                return 'rgba(75,192,192,1)'; // ✅ 정상값 → 파란 외곽
                })
            },
            {
              label: '기준 감쇠선 (guide_activity)',     // 기준선 (192 Ir)
              data: toXY('guide_activity'),
              borderColor: 'rgba(255,206,86,1)',         // 노란 점선
              borderDash: [],
              pointRadius: 0
            },
            {
              label: '상한선 (upper_limit)',             // 허용 상한선
              data: toXY('upper_limit'),
              borderColor: 'rgba(255,99,132,0.2)',       // 빨간 점선
              borderDash: [],
              pointRadius: 0,
              tension: 0.3
            },
            {
              label: '하한선 (lower_limit)',             // 허용 하한선
              data: toXY('lower_limit'),
              borderColor: 'rgba(255,99,132,0.2)',       // 빨간 점선
              borderDash: [],
              pointRadius: 0
            }
          ],
          ///////////////
          ///// 애노테이션 정보 포함 : threshold 선 
          // => 문제점 : 4이하로 떨어질는 최초의 순간만 그어주고 있음. 
          // 해결 방안 
          // 1.(4에 해당하는 날짜)데이터 정보를 추가해 그래프에 올리는 방법
          // 2. 이 부분이 필요한 이유 중 하나는 결국 가장 최근의 duration 부분에서 언제 교체해야되는지 checking을 하기 위해서이므로, 가장 마지막 duration에서만 표시 하는 방법
          //    => 마지막 duration의 guide_activity는 3까지 표시하게 만들어야하며, 이전에 새로운 선원이 들어오게 되면 이전 duration까지 가이드해주고 다시 새로운 가이드를 생성(~3까지)
          //////////////////////
        //   options: {
        //     plugins: {
        //       annotation: markerDate
        //         ? {
        //             annotations: {
        //               markerLine: {
        //                 type: 'line',
        //                 scaleID: 'x',
        //                 value: new Date(markerDate), // 세로선 위치
        //                 borderColor: 'red',
        //                 borderWidth: 2,
        //                 label: {
        //                   display: true,
        //                   content: '기준선 도달',
        //                   backgroundColor: 'rgba(255,0,0,0.2)',
        //                   position: 'start'
        //                 }
        //               }
        //             }
        //           }
        //         : {}
        //     }
        //   }
          //////////////////////
        });
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패:', err);
        setChartData(null);
      }
    };

    fetchData(); // 호출 실행
  }, [start, end, selectedDuration]); // start 또는 end가 바뀌면 다시 fetch

  // ⚙️ Chart.js 옵션 설정
  const chartOptions = {
    responsive: true, // 반응형 설정
    scales: {
      x: {
        type: 'time', // X축을 시간 기반으로
        time: {
          unit: 'day', // 일 단위 눈금
          tooltipFormat: 'yyyy-MM-dd', // 툴팁 포맷
          displayFormats: {
            day: 'yyyy-MM-dd'
          }
        },
        title: {
          display: true,
          text: '날짜'
        }
      },
      y: {
        title: {
          display: true,
          text: 'activity'
        }
      }
    },
    plugins: {
      tooltip: {
        mode: 'index', //포인트별이 아닌 "날짜별(같은 x축 값)"로 묶기
        intersect: false, //툴팁이 반드시 점 위에 마우스가 있어야 뜨는 걸 강제하지 않도록 설정하는 옵션
        callbacks: {
          // ⏱️ 툴팁 하단에 duration 추가 표시
          afterBody: (tooltipItems) => {
            const item = tooltipItems[0];
            const dt = new Date(item.parsed.x);
            const matched = rawData.find(r => new Date(r.datetime).getTime() === dt.getTime());
            if (matched && matched.duration != null) {
              return `⏱️ DURATION : ${matched.duration}`; // 예: 15분
            }
            return null;
          }
        }
      }
    }
  };

  // 📦 화면 구성: 날짜 선택 + 차트 렌더링

  return (
    //   <h3>📅 날짜/시간 선택</h3>

//   {/* 날짜 선택 UI */}
//   <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
//     <label>Start:</label>
//     <DatePicker
//       selected={start}
//       onChange={(date) => setStart(date)}
//       dateFormat="yyyy-MM-dd"
//     />
//     <label>End:</label>
//     <DatePicker
//       selected={end}
//       onChange={(date) => setEnd(date)}
//       dateFormat="yyyy-MM-dd"
//     />
//   </div>
    <div style={{ width: '90%', margin: '0 auto' }}>
  
      <h3>📅 날짜 / 시간 / duration 선택</h3>

      {/* 📆 날짜 선택 및 ⏱️ 지속시간 드롭다운 */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <label>Start:</label>
        <DatePicker selected={start} onChange={(date) => setStart(date)} dateFormat="yyyy-MM-dd" />

        <label>End:</label>
        <DatePicker selected={end} onChange={(date) => setEnd(date)} dateFormat="yyyy-MM-dd" />

        <label>⏱️ Duration:</label>
        <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
          <option value="all">전체</option>
          {/* duration 값들 드롭다운 구성 */}
          {durationList.map((d) => (
            <option key={d} value={d}>duration {d}</option>
          ))}
          {/* duration이 미기재된 데이터가 있으면 '미기재' 옵션 추가 */}
          {rawData.some(r => r.duration == null) && <option value="null">미기재</option>}
        </select>
      </div>
      {/* 차트 출력 */}
      <h3>📈 방사능 감쇠량 추이</h3>
      {chartData ? (
        // <Line data={chartData} options={chartOptions} />
        <Line
          data={chartData}
          options={{
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                ...chartData.options?.plugins // ← 여기에 세로선 annotation이 포함되어 있음
    }
  }}
/>

      ) : (
        <div>📡 데이터가 없습니다. 날짜를 변경해보세요.</div>
      )}
    </div>
  );
};

// ✅ 컴포넌트 내보내기 (다른 파일에서 import 가능하게)
export default RadiationChart;

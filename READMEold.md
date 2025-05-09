# 📘 Java BI Tool - Frontend Chart.js 튜토리얼

## 🎯 목표

React + Chart.js를 활용하여 Java(Spring Boot) 기반 BI Tool의 실시간 방사능 감쇠량 데이터를 시각화하는 프론트엔드 구축하기

---

## 📦 1장. 프론트 프로젝트 생성

### ✅ React 앱 생성

```bash
npx create-react-app bitool_front
cd bitool_front
```

### ✅ 주요 라이브러리 설치

```bash
npm install chart.js react-chartjs-2 axios react-datepicker chartjs-adapter-date-fns
```

### ✅ CSS 포함 설정

`src/index.css` 또는 `App.css`에 다음 추가:

```css
@import 'react-datepicker/dist/react-datepicker.css';
```

---

## 🧭 2장. 디렉토리 구조

```
bitool_front/
├── src/
│   ├── components/
│   │   └── RadiationChart.js   # 메인 차트 컴포넌트
│   └── services/
│       └── api.js              # 백엔드 API 호출 axios 인스턴스
```

---

## 📡 3장. Axios 설정 - `/services/api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
```

---

## 📈 4장. 차트 컴포넌트 구현 - `/components/RadiationChart.js`

```jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const RadiationChart = () => {
  const [start, setStart] = useState(new Date(new Date().setHours(new Date().getHours() - 1)));
  const [end, setEnd] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/radiation-activity', {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });

        const dataPoints = res.data.data.map(d => ({
          x: new Date(d.datetime),
          y: d.calculatedact
        }));

        setChartData({
          datasets: [{
            label: '감쇠량 (calculatedact)',
            data: dataPoints,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.3,
            pointRadius: 2,
            fill: false,
          }]
        });
      } catch (err) {
        console.error(err);
        setChartData(null);
      }
    };
    fetchData();
  }, [start, end]);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd',
          displayFormats: {
            day: 'yyyy-MM-dd',
          },
        },
        title: { display: true, text: '날짜' },
      },
      y: {
        title: { display: true, text: '감쇠량' },
      },
    },
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h3>📅 날짜/시간 선택</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <label>Start:</label>
        <DatePicker selected={start} onChange={setStart} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
        <label>End:</label>
        <DatePicker selected={end} onChange={setEnd} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
      </div>
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
```

---

## 🌐 5장. 백엔드 CORS 설정 (Spring Boot)

`WebConfig.java` 생성

```java
package com.yourcompany.bitool.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## ✅ 6장. 실행 및 결과 확인

* 백엔드 실행: `localhost:8080`
* 프론트 실행:

```bash
npm start
```

* 접속: [http://localhost:3000](http://localhost:3000)
* 날짜 범위 선택 → 실시간 방사능 시계열 그래프 시각화 완료

---

## 🧩 다음 단계 (확장 아이디어)

* 기준 감쇠량 ±3% 선 추가
* 하루 평균값만 추출 (백엔드 집계 or 프론트 요약)
* 다중 차트 비교 (계측기별 데이터 등)
* 다운샘플링 or 줌/스크롤 기능 추가

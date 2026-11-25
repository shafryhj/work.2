// ============================================================
// 별빛 카페 대시보드 — 차트 렌더링 (Chart.js)
// ============================================================

// 숫자 포맷: 1,000 단위 콤마 + 원
function formatKRW(n) {
  return n.toLocaleString('ko-KR') + '원';
}

// ─── ① 일별 매출 꺾은선 차트 ─────────────────────────────
function renderDailyRevenueChart() {
  const ctx = document.getElementById('dailyRevenueChart').getContext('2d');
  const labels = DAILY_DATA.map(d => d.date.slice(5));  // MM-DD
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '일별 매출 (원)',
        data: dailyRevenues,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.12)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        borderWidth: 2.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + formatKRW(ctx.parsed.y)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: v => (v / 10000).toFixed(0) + '만'
          },
          title: { display: true, text: '매출 (원)' }
        },
        x: {
          title: { display: true, text: '날짜 (월-일)' }
        }
      }
    }
  });
}

// ─── ② 메뉴별 판매량 막대 차트 ───────────────────────────
function renderMenuBarChart() {
  const ctx = document.getElementById('menuBarChart').getContext('2d');
  const bgColors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MENU_NAMES.map(m => MENU_DISPLAY_NAMES[m]),
      datasets: [{
        label: '총 판매량 (잔)',
        data: MENU_NAMES.map(m => menuTotalQty[m]),
        backgroundColor: bgColors,
        borderColor: bgColors.map(c => c),
        borderWidth: 1,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.parsed.y.toLocaleString('ko-KR') + '잔'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: '판매량 (잔)' }
        }
      }
    }
  });
}

// ─── ③ 요일별 평균 매출 표 ────────────────────────────────
function renderDayOfWeekTable() {
  const tbody = document.getElementById('dowTableBody');
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  let maxDay = days[0], maxVal = 0;
  days.forEach(d => {
    if (avgRevenueByDay[d] > maxVal) { maxVal = avgRevenueByDay[d]; maxDay = d; }
  });
  days.forEach(day => {
    const tr = document.createElement('tr');
    const isMax = day === maxDay;
    tr.innerHTML = `
      <td>${day}요일</td>
      <td class="${isMax ? 'highlight' : ''}">${formatKRW(avgRevenueByDay[day])}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── 요약 카드 ────────────────────────────────────────────
function renderSummaryCards() {
  document.getElementById('totalRevenue').textContent = formatKRW(totalRevenue);

  const avgDaily = Math.round(totalRevenue / DAILY_DATA.length);
  document.getElementById('avgDailyRevenue').textContent = formatKRW(avgDaily);

  const totalCups = Object.values(menuTotalQty).reduce((a, b) => a + b, 0);
  document.getElementById('totalCups').textContent = totalCups.toLocaleString('ko-KR') + '잔';

  // 베스트 메뉴
  let bestMenu = MENU_NAMES[0], bestQty = 0;
  MENU_NAMES.forEach(m => {
    if (menuTotalQty[m] > bestQty) { bestQty = menuTotalQty[m]; bestMenu = m; }
  });
  const bestDisplayName = MENU_DISPLAY_NAMES[bestMenu].join(' ');
  document.getElementById('bestMenu').textContent = bestDisplayName + ' (' + bestQty.toLocaleString('ko-KR') + '잔)';
}

// ─── 초기화 ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderSummaryCards();
  renderDailyRevenueChart();
  renderMenuBarChart();
  renderDayOfWeekTable();
});

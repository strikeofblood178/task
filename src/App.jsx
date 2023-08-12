

import React, { useEffect, useState } from 'react';
import './App.css';
import { TbTriangleInvertedFilled } from 'react-icons/tb';

function App() {
  const [contributions, setContributions] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    fetch('https://dpg.gg/test/calendar.json')
      .then((response) => response.json())
      .then((data) => {
        setContributions(data);
        generateGridData(data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
      });
  }, []);

  const generateGridData = (data) => {
    const startDate = new Date('2022-09-01');
    const endDate = new Date('2023-08-12');
    const daysInRange = Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const newData = [];
    let currentDate = new Date(startDate);
    let currentColumnData = [];

    for (let i = 0; i < daysInRange; i++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const contributionCount = data[dateString] || 0;
      currentColumnData.push({ date: dateString, count: contributionCount });

      if (currentColumnData.length === 7) {
        newData.push([...currentColumnData]);
        currentColumnData = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Добавляем дополнительную колонку для достижения 51 ячейки
    if (currentColumnData.length > 0) {
      while (currentColumnData.length < 7) {
        currentColumnData.push({ date: '', count: 0 });
      }
      newData.push([...currentColumnData]);
    }

    setGridData(newData);
  };

  const handleCellClick = (data, event) => {
    if (event.target.className.includes('block')) {
      setSelectedCell({ ...data, x: event.clientX, y: event.clientY });
    }
  };

  const handleOutsideClick = () => {
    setSelectedCell(null);
  };

  const renderContributionBlock = (count, date) => {
    if (date === '') {
      return <span className="block empty-cell" />;
    }
    return (
      <span className={`block ${getContributionsClass(count)}`} onClick={(e) => handleCellClick({ count, date }, e)}>
        {count}
      </span>
    );
  };

  const getContributionsClass = (count) => {
    if (count === 0) {
      return 'no-contributions';
    } else if (count < 10) {
      return 'low-contributions';
    } else if (count < 20) {
      return 'medium-contributions';
    } else if (count < 30) {
      return 'high-contributions';
    } else {
      return 'very-high-contributions';
    }
  };

  const renderWeekdayLabels = () => {
    const weekdays = ['Чт', 'Пт', 'Сб', 'Вс', 'Пн', 'Вт', 'Ср'];

    return weekdays.map((weekday, index) => (
      <div key={index} className="weekday-label">
        {weekday}
      </div>
    ));
  };

  const renderMonthLabels = () => {
    const months = [
      'Сент.', 'Окт.', 'Нояб.', 'Дек.', 'Янв.', 'Февр.', 'Март.', 'Апр.', 'Май.', 'Июнь.', 'Июль.', 'Авг.'
    ];

    return months.map((month, index) => (
      <div key={index} className="month-label">
        {month}
      </div>
    ));
  };

  const renderContributionGrid = () => {
    return gridData.map((columnData, columnIndex) => (
      <div key={columnIndex} className="contribution-column">
        {columnData.map((data, index) => (
          <div key={index} className="contribution-cell">
            {renderContributionBlock(data.count, data.date)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <section className="App">
      <h1>График контрибуций</h1>
      <div className="month-labels">{renderMonthLabels()}</div>
      <div className="grid-container">
        <div className="weekdays">{renderWeekdayLabels()}</div>
        <div className="contribution-grid">{renderContributionGrid()}</div>
        {selectedCell && (
          <div className="popup" style={{ left: selectedCell.x - 65, top: selectedCell.y - 55 }} onClick={handleOutsideClick}>
            <p className="popup-count">{selectedCell.count} contributions</p>
            <p className="popup-date">{new Date(selectedCell.date).toLocaleString('ru', { weekday: 'long' }).charAt(0).toUpperCase() + new Date(selectedCell.date).toLocaleString('ru', { weekday: 'long' }).slice(1)}, {new Date(selectedCell.date).toLocaleString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div className='icon'>
            <TbTriangleInvertedFilled/>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
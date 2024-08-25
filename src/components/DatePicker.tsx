import React, { useState } from 'react';
import moment from 'moment';
import { DatePickerProps } from '../types';

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleDateChange = () => {
        const frmt = 'YYYY-MM-DD';
        const formattedStartDate = moment(startDate).format(frmt);
        const formattedEndDate = moment(endDate).format(frmt);

        onDateChange(formattedStartDate, formattedEndDate);
    };

    return (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f0f0f0', gap: '10px' }}>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <button onClick={handleDateChange} style={{ padding: '5px 10px', }}>Встановити період</button>
        </div>
    );
};

export default DatePicker;

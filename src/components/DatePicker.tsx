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
        <div>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleDateChange}>Set Period</button>
        </div>
    );
};

export default DatePicker;

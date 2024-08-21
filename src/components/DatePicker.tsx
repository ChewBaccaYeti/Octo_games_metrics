import React, { useState } from 'react';

interface DatePickerProps {
    onDateChange: (startDate: string, endDate: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleDateChange = () => {
        onDateChange(startDate, endDate);
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

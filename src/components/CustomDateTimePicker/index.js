import "./CustomDateTimePicker.scss"; // file CSS để tạo giao diện giống ảnh
import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <TextField
    label="Chọn ngày và giờ"
    value={value}
    onClick={onClick}
    ref={ref}
    fullWidth
    InputProps={{
      readOnly: true,
    }}
  />
));

const CustomDateTimePicker = () => {
    const [startDate, setStartDate] = useState(new Date());

    // Format ngày giờ theo DD/MM/YYYY h:mm A
    const formattedValue = format(startDate, "dd/MM/yyyy h:mmaa");

    return (
        <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        timeIntervals={30}
        dateFormat="dd/MM/yyyy h:mmaa" // chỉ để React-datepicker xử lý nội bộ
        customInput={<CustomInput value={formattedValue} />}
        calendarClassName="custom-calendar"
        popperPlacement="bottom-start"
        />
    );
};

export default CustomDateTimePicker;


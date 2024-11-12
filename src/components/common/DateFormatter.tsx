import React from 'react';
import moment from 'moment';

interface DateFormatterProps {
  date: string | Date | null;
  format?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({
  date,
  format = 'YYYY-MM-DD HH:mm',
}) => {
  const formattedDate =
    date && moment(date).isValid()
      ? moment(date).format(format)
      : 'Invalid Date';

  return <>{formattedDate}</>;
};

export default DateFormatter;

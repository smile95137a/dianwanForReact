import moment from 'moment';

interface DateFormatterProps {
  date: string | Date;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ date }) => {
  const formattedDate = moment(date).isValid()
    ? moment(date).format('YYYY-MM-DD HH:mm')
    : '';

  return <>{formattedDate}</>;
};

export default DateFormatter;

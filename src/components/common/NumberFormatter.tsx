import React from 'react';

interface NumberFormatterProps {
  number: number;
  locale?: string;
  options?: Intl.NumberFormatOptions;
}

const NumberFormatter: React.FC<NumberFormatterProps> = ({
  number,
  locale = 'en-US',
  options = {},
}) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    ...options,
  });

  return <>{formatter.format(number)}</>;
};

export default NumberFormatter;

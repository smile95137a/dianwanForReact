import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { getAllMarquees } from '@/services/frontend/marqueeService';
import { FaBullhorn } from 'react-icons/fa';

interface MarqueeMessage {
  grade: string;
  name: string;
  createDate: string;
  shouldDisplay: boolean;
  username: string;
}

const Marquee = () => {
  const [marqueeMessageData, setMarqueeMessageData] = useState<any[]>([]);
  const marqueeInterval = useRef<NodeJS.Timeout | null>(null);

  // Process marquee data
  const processMarqueeData = async () => {
    try {
      const { success, data } = await getAllMarquees();
      if (success) {
        if (Object.keys(data).length > 0) {
          const currentTime = moment();
          const result = Object.keys(data).map((key) =>
            data[key].map((marquee: MarqueeMessage) => {
              const createDate = moment(marquee.createDate);
              const updatedDate = createDate.add(60, 'seconds');
              const shouldDisplay = updatedDate.isAfter(currentTime);
              return {
                ...marquee,
                shouldDisplay,
              };
            })
          );

          const transformedData = result.map((group) => {
            const title = group[0]?.username;
            return {
              title,
              list: group,
            };
          });

          const filteredGroup = transformedData.filter(
            (x) => x.list.length > 0 && x.list[0].shouldDisplay
          );

          const lastData =
            filteredGroup.length === 0
              ? [transformedData[transformedData.length - 1]]
              : filteredGroup;

          setMarqueeMessageData(lastData);
        } else {
          console.error('Unable to fetch marquee data or request failed');
        }
      }
    } catch (error) {
      console.error('Failed to fetch marquee data:', error);
    }
  };

  useEffect(() => {
    processMarqueeData();

    marqueeInterval.current = setInterval(() => {
      processMarqueeData();
    }, 2000);

    return () => {
      if (marqueeInterval.current) {
        clearInterval(marqueeInterval.current);
      }
    };
  }, []);

  const calculateAnimationDuration = () => {
    const textList = marqueeMessageData.map((x: any) =>
      x.list.map(({ grade, name }: any) => `${grade}賞 ${name}`).join(' 和 ')
    );
    const concatenatedText = textList.join('');
    const textLength = concatenatedText.length;

    const targetSpeed = 100;
    const containerWidth = window.innerWidth;

    const totalDistance = Math.max(containerWidth, textLength * 10);
    const duration = totalDistance / targetSpeed;

    return `${duration}s`;
  };

  const getColor = (index: number) => {
    const colors = ['#4285F4', '#4285F4'];
    return colors[index % colors.length];
  };

  const getMarqueeMsg = (list: any[]) => {
    return list.map(({ grade, name }) => `${grade}賞 ${name}`).join(' 和 ');
  };

  return (
    <>
      {marqueeMessageData.length > 0 && (
        <div className={`marquee`}>
          <div className="marquee__logo">
            <FaBullhorn />
          </div>
          <div className="marquee__msg">
            <p
              className="marquee__text"
              style={{ animationDuration: calculateAnimationDuration() }}
            >
              {marqueeMessageData.map((item, index) => (
                <span key={index}>
                  🎉恭喜🎉
                  <span style={{ color: getColor(0), fontWeight: 'bold' }}>
                    {item.title}
                  </span>
                  中獎 中獎的獎項為
                  <span style={{ color: getColor(1), fontWeight: 'bold' }}>
                    {getMarqueeMsg(item.list)}
                  </span>
                  請大家一起恭喜他 ~
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Marquee;

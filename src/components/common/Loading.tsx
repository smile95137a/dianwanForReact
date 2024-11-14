const Loading: React.FC = () => {
  return (
    <div className="loader">
      <span className="loader__img">
        <div></div>
        <div></div>
        <div></div>
        <p className="loader__text">loading...</p>
      </span>
    </div>
  );
};

export default Loading;

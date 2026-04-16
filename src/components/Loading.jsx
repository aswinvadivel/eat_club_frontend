import '../styles/Loading.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loading;

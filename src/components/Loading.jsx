
const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loading;

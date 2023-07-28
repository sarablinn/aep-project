const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return <div>{errorMessage}</div>;
};

ErrorMessage.defaultProps = {
  errorMessage: 'ERROR',
};

export default ErrorMessage;

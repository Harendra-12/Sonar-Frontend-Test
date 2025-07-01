// src/components/ErrorBoundary.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

class ErrorBoundaryWithoutHooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // ✅ Reset error state when location changes
    if (this.props.location !== prevProps.location && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleGoBack = () => {
    this.props.navigate(-1);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          {/* <p>{this.state.error?.message}</p> */}
          <button onClick={this.handleGoBack}>Go Back</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ErrorBoundaryWithoutHooks
      {...props}
      navigate={navigate}
      location={location.pathname}
    />
  );
};

export default ErrorBoundary;

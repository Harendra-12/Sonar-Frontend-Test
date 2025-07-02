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
    this.props.navigate("/dashboard");
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mainContent">
          <div className="d-flex flex-column align-items-center justify-content-center " style={{ height: "100vh" }}>
            <div className="wrongImg">
              <img src={require("./Components/assets/images/went-wrong.png")} alt="background" />
            </div>
            <h2>Something went wrong.</h2>
            <p>Brack yourself till we get the error fixed.</p>
            {/* <p>{this.state.error?.message}</p> */}
            <button onClick={this.handleGoBack} class="panelButton static add mt-3" type="submit"><span class="text text-white">Home</span></button>
          </div>
        </main>
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

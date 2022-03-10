import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineReload } from 'react-icons/ai';

import { Button } from '../../../utils/styles/buttons';
import { Centered, Hr, Wrapper } from '../../../utils/styles/misc';
import { Body, H2 } from '../../../utils/styles/text';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error("Uh oh! Error: " + error)
    console.error(JSON.stringify(errorInfo))
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
          <div style={{ height: "100vh" }}>
            <Wrapper>
                <H2>Something went wrong</H2>
                <Body>Sorry about this! Please <Link to="/about">contact us</Link> if the error persists.</Body>
                <Hr/>
                <Body size="sm">  
                    <b>More info:</b>  
                    <br/>
                    {this.state.error && this.state.error.toString()}
                </Body>
                <Hr/>
                <Centered margin="25px 0">
                    <Button onClick={() => window.location.reload()}><AiOutlineReload /> Reload page</Button>
                </Centered>
            </Wrapper>
          </div>
        
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
export default ErrorBoundary;
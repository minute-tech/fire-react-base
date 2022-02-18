import {
    useLocation,
    useNavigate,
    useParams
  } from "react-router-dom";
  
export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        return (
            <Component
                {...props}
                navigate={useNavigate()}
                params={useParams()}
                location={useLocation()}
            />
        );
    }

    return ComponentWithRouterProp;
}
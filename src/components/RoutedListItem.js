import React from "react";
import {Link, withRouter} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

function RoutedListItem(props) {
    const {icon, primary, to, location} = props;

    //Copied from MaterialUI, still figuring out how this works
    const renderLink = React.useMemo(
        () =>
            React.forwardRef((linkProps, ref) => (
                <Link ref={ref} to={to} {...linkProps} />
            )),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} selected={location.pathname.toLowerCase() === to}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

export default withRouter(RoutedListItem)
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

function RoutedListItem(props) {
    const { icon, primary, to, location, onClick, headerText = true, headerProps = {}, fuzzyMatch = false } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef((linkProps, ref) => (
                <Link ref={ ref } to={ to } { ...linkProps } />
            )),
        [to],
    );

    const selected = fuzzyMatch ? location.pathname.toLowerCase().startsWith(to) : location.pathname.toLowerCase() === to;

    return (
        <li>
            <ListItem button component={ renderLink } onClick={ onClick }
                      selected={ selected }>
                {
                    icon &&
                    <ListItemIcon>{ icon }</ListItemIcon>
                }
                {
                    headerText ?
                        <ListItemText { ...headerProps } primary={ primary }/> :
                        <span { ...headerProps }>{ primary }</span>
                }
            </ListItem>
        </li>
    );
}

export default withRouter(RoutedListItem);
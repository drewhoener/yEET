import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const useStyle = makeStyles(theme => ({
    smallIcon: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        margin: '0 auto',
        marginRight: 0,
        fontSize: '.8rem'
        // paddingRight: 0
    },
}));

const showNotify = false;

function RoutedListItem(props) {
    const { icon, primary, to, location, notify, onClick, headerText = true, headerProps = {} } = props;
    const classes = useStyle();
    // Copied from MaterialUI, still figuring out how this works
    const renderLink = React.useMemo(
        () =>
            React.forwardRef((linkProps, ref) => (
                <Link ref={ ref } to={ to } { ...linkProps } />
            )),
        [to],
    );

    return (
        <li>
            <ListItem button component={ renderLink } onClick={ onClick }
                      selected={ location.pathname.toLowerCase() === to }>
                {
                    icon &&
                    <ListItemIcon>{ icon }</ListItemIcon>
                }
                {
                    headerText ?
                        <ListItemText { ...headerProps } primary={ primary }/> :
                        <span { ...headerProps }>{ primary }</span>
                }
                {
                    showNotify &&
                    notify > 0 ?
                        (
                            <ListItemAvatar>
                                <Avatar aria-label={ `${ notify } item${ notify === 1 ? '' : 's' } unfinished` }
                                        className={ classes.smallIcon } variant='circle'>{ notify }</Avatar>
                            </ListItemAvatar>
                        ) : null
                }

            </ListItem>
        </li>
    );
}

export default withRouter(RoutedListItem);
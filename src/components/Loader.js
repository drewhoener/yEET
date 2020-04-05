import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

const Loader = ({ className, visible }) => {
    return visible &&
        (
            <div className={ className }>
                <CircularProgress size='7.3rem' thickness={ 2 } variant='indeterminate'/>
            </div>
        );
};

export default Loader;
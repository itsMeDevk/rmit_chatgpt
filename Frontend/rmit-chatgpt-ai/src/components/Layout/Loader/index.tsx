import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => {

    return (
        <Box>
            <CircularProgress />
        </Box>
    );
}

export default Loader;

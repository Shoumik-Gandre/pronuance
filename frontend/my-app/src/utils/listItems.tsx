import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to={'/dashboard'}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton  component={Link} to={'/challenges'}>
            <ListItemIcon>
                <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Challenges" />
        </ListItemButton>
        <ListItemButton  component={Link} to={'/practice-words'}>
            <ListItemIcon>
                <AutoStoriesIcon />
            </ListItemIcon>
            <ListItemText primary="Practice Words" />
        </ListItemButton>
        <ListItemButton  component={Link} to={'/practice-sentences'}>
            <ListItemIcon>
                <AutoStoriesIcon />
            </ListItemIcon>
            <ListItemText primary="Practice Sentences" />
        </ListItemButton>
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Organization details
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="About Us" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
        </ListItemButton>
    </React.Fragment>
);
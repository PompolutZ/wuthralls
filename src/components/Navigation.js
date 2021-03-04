import React from "react";
import * as ROUTES from "../constants/routes";
import { useAuthUser } from "./Session";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { FirebaseContext } from "../firebase";
import { useHistory } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import packageJson from "../../package.json";
import PropTypes from "prop-types";
import { ADMIN } from "../constants/roles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },

    accountButton: {},

    title: {
        flexGrow: 1,
        cursor: "pointer",
    },
}));

function MenuDrawer({ items, userRoles }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (side, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = (side) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {items.map((item) => {
                    if (
                        item.restrictedTo &&
                        !(userRoles && userRoles[item.restrictedTo])
                    ) {
                        return;
                    }

                    return (
                        <ListItem button key={item.id} onClick={item.action}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <div>
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer("left", true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
                {sideList("left")}
            </Drawer>
        </div>
    );
}

MenuDrawer.propTypes = {
    items: PropTypes.array,
    userRoles: PropTypes.object,
};

function AnonMenu() {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const navigateToSignIn = () => {
        handleClose();
        history.push(ROUTES.SIGN_IN);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="anonymous user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                edge="end"
                onClick={handleMenu}
                className={classes.accountButton}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={navigateToSignIn}>Login</MenuItem>
            </Menu>
        </div>
    );
}

function AuthMenu({ authUser }) {
    const history = useHistory();
    const firebase = React.useContext(FirebaseContext);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const signOut = () => {
        handleClose();
        firebase.signOut();
    };

    const goToMyAccount = () => {
        handleClose();
        history.push(`/player-info`, { pid: authUser.uid });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        borderRight: "1px solid white",
                        paddingRight: ".5rem",
                        marginRight: 0,
                    }}
                >
                    <Typography style={{ fontSize: ".7rem" }}>
                        {authUser.username}
                    </Typography>
                </div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    edge="end"
                    onClick={handleMenu}
                    className={classes.accountButton}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </div>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={goToMyAccount}>My account</MenuItem>
                <MenuItem onClick={signOut}>Logout</MenuItem>
            </Menu>
        </div>
    );
}

AuthMenu.propTypes = {
    authUser: PropTypes.object,
};

const menuItems = (history) => [
    {
        id: "all_rooms",
        label: "All rooms",
        icon: <MeetingRoomIcon />,
        action: () => history.push(ROUTES.LANDING),
    },
    {
        id: "history",
        label: "History",
        icon: <EmojiEventsIcon />,
        action: () => history.push("/history"),
    },
    {
        id: "upcoming",
        label: "Upcoming",
        icon: <HourglassEmptyIcon />,
        action: () => history.push("/future"),
    },
    {
        id: "playground",
        label: "Playground",
        icon: <ChildCareIcon />,
        action: () => history.push("/playground"),
        restrictedTo: ADMIN,
    },
];

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    window: PropTypes.func,
    children: PropTypes.object,
};

function Navigation(props) {
    const classes = useStyles();
    const history = useHistory();
    const authUser = useAuthUser();

    const goToMainPage = () => {
        history.push(ROUTES.LANDING);
    };

    return (
        <div className={classes.root}>
            <HideOnScroll {...props}>
                <AppBar position="static">
                    <Toolbar>
                        <MenuDrawer
                            items={menuItems(history)}
                            userRoles={authUser && authUser.roles}
                        />
                        <Typography
                            variant="body1"
                            className={classes.title}
                            onClick={goToMainPage}
                        >
                            WUnderworlds Club{" "}
                            <sup>
                                <span style={{ fontSize: ".7rem" }}>
                                    <i>ver {packageJson.version}</i>
                                </span>
                            </sup>
                        </Typography>
                        {authUser ? (
                            <AuthMenu authUser={authUser} />
                        ) : (
                            <AnonMenu />
                        )}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </div>
    );
}

export default Navigation;

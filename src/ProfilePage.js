import './App.css';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline, Avatar } from '@mui/material';
import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { brown, green, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { auth, googleProvider } from "./config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage'; 
import ReactDOM from 'react-dom/client';
import { db } from './config/firebase';
import { doc, getDoc, getDocs, collection, addDoc } from 'firebase/firestore';
import { storage } from './config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Logout } from '@mui/icons-material';
import { Settings } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';

const root = ReactDOM.createRoot(document.getElementById('root'));

function openHomePage() {
    return(
        root.render(
            <React.StrictMode>
                <HomePage />
            </React.StrictMode>
        )
    );
}

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
}

export function ProfilePage() {
    //const userDetailsRef = collection(db, 'userDetails');
    const [userDetails, setUserDetails] = React.useState([]);
    const email = auth.currentUser.email;
    const userDetailsRef = doc(db, 'userDetails', email);
    const [imageURL, setImageURL] = React.useState("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fprofile-icon-png&psig=AOvVaw2FwlFM5yJSfJWzG794LVn_&ust=1722090728962000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKiJ8IL2xIcDFQAAAAAdAAAAABAE");
    const [anchorE1, setAnchorE1] = React.useState(null);
    const open = Boolean(anchorE1);

    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch(err) {
            console.log(err)
        }
    };

    React.useEffect(() => {
        const getUserDetails = async () => {
            try {
                //const details = await doc(userDetailsRef);
                const details = await getDoc(userDetailsRef);
                /*const filteredData = details.docs.map((detail) => ({
                    ...detail.data(),
                    id: detail.id,
                }));*/
                const filteredData = details.data();
                setUserDetails(filteredData);
                //console.log(filteredData);
            } catch(err) {
                console.log(err);
            }
        };

        getUserDetails();
    }, []);

    const getImageURL = async () => {
        try {
            const url = await getDownloadURL(ref(storage, 'ProfilePicture/' + email + '/profilepicture.png'));
            setImageURL(url);
        } catch(err) {
            console.log(err);
        }
    };

    const [fileUpload, setFileUpload] = React.useState(null);

    const uploadProfilePicture = async () => {
        if (!fileUpload) return;
        const filesFolderRef = ref(storage, 'ProfilePicture/' + email + '/profilepicture.png');
        try {
            await uploadBytes(filesFolderRef, fileUpload);
            getImageURL();
        } catch(err) {
            console.log(err);
        }
    };

    getImageURL();

    return(
        <>
        <AppBar position='relative'>
            <Toolbar>
                <IconButton 
                    onClick={handleClick}
                    aria-controls={open ? 'menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 60, height: 60 }}>Menu</Avatar>
                </IconButton>
                <br />
    <Menu
        anchorEl={anchorE1}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
                    <MenuItem onClick={openHomePage}>
                        <Avatar /> HomePage
                    </MenuItem>
                    <MenuItem>
                        About AyushChat
                    </MenuItem>
                    <MenuItem>
                        <Settings /> Settings
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Logout /> Sign Out
                    </MenuItem>
                </Menu>
                <HomeIcon sx={{ color: yellow[500], fontSize: 40 }} />
                <Typography variant='h6'>Profile Page</Typography>
            </Toolbar>
        </AppBar>
        <br />
        <div className='ProfilePage'>
            <Typography variant='h5' align='center'>User Details</Typography>
            <br />
            <div className='UserDetails'>
                    <div>
                        <img className='ProfilePictureImage' src={imageURL} />
                        <br />
                        <input id='fileInput' onChange={(e) => setFileUpload(e.target.files[0])} type='file' />
                        <br />
                        <br />
                        <Button onClick={uploadProfilePicture} className='Button' variant='contained' color='success'>Upload Profile Picture(PNG Only)</Button>
                        <br />
                        <br />
                        <Typography align='center' variant='h6'>Name</Typography>
                        <br />
                        <Typography align='center' variant='body1'>{userDetails.Name}</Typography>
                        <br />
                        <Typography align='center' variant='h6'>Email</Typography>
                        <br />
                        <Typography align='center' variant='body1'>{userDetails.Email}</Typography>
                    </div>
            </div>
        </div>
        </>
    );
}

export default ProfilePage;
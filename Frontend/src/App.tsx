import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, redirect, BrowserRouter as Router } from "react-router-dom";
import Loading from "./components/Loading";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { UserReducerInitialState } from "./types/reducer-types";

import AppRoutes from "./AppRoutes";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

const App = () => {
	const { user, loading } = useSelector(
		(state: { userReducer: UserReducerInitialState }) =>
			state.userReducer || { user: null }
	);
	const dispatch = useDispatch();

	useEffect(() => {
	    const unsubscribe = onAuthStateChanged(auth, async (user) => {
	        try {
	            if (user) {
	                console.log('User is logged in:', user.uid);
	                const data = await getUser(user.uid);
	                if (data?.user) {
	                    dispatch(userExist(data.user));
	                } else {
	                    console.warn('No user data returned from getUser API');
	                    dispatch(userNotExist());
	                }
	            } else {
	                console.log('No user is logged in');
	                dispatch(userNotExist());

	            }
	        } catch (error) {
	            console.error('Error during auth state change:', error);
	            // Optional: dispatch an error action if your Redux store handles it
	            // dispatch(userError(error));
	            dispatch(userNotExist());
	        }
	    });

	    // Clean up the listener on unmount
	    return () => unsubscribe();
	}, [dispatch]);

	// useEffect(() => {
	// 	setPersistence(auth, browserLocalPersistence)
	// 		.then(() => {
	// 			const unsubscribe = onAuthStateChanged(auth, async (user) => {
	// 				try {
	// 					if (user) {
	// 						console.log("User is logged in:", user.uid);
	// 						const data = await getUser(user.uid);
	// 						if (data?.user) {
	// 							dispatch(userExist(data.user));
	// 						} else {
	// 							dispatch(userNotExist());
	// 						}
	// 					} else {
	// 						dispatch(userNotExist());
	// 					}
	// 				} catch (error) {
	// 					console.error("Auth state error:", error);
	// 					dispatch(userNotExist());
	// 				}
	// 			});

	// 			// Cleanup
	// 			return () => unsubscribe();
	// 		})
	// 		.catch((error) => {
	// 			console.error("Setting persistence failed:", error);
	// 		});
	// }, [dispatch]);

	return loading ? (
		<Loading />
	) : (
		<Router>
			<AppRoutes user={user} />
			<Toaster position="top-center" />
		</Router>
	);
};

export default App;

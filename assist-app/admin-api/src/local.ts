import expressMain from "./express-main";
//import {fbAdmin} from "./config/firebase";

// fbAdmin.initializeApp({
//     credential: fbAdmin.credential.cert(serviceAccount as fbAdmin.ServiceAccount),
//     databaseURL: "https://collect-server-default-rtdb.firebaseio.com",
// });

const PORT = process.env.PORT || 5000;
expressMain.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

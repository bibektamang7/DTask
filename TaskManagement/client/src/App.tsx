import React, { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Not_Fount from "./components/Not_Fount";

import Error from "./components/Error";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import ErrorComponent from "./components/ErrorComponent";
import Loader from "./components/Loader";




const router = createBrowserRouter(
  createRoutesFromElements(
    <React.Fragment>
      <Route
        path="/"
        element={<RootLayout />}
        errorElement={<Error />}
      >
        <Route
          index
          element={<Home/>}
          errorElement={<ErrorComponent />}
        />
        <Route
          path="signup"
          element={<>SignUp Page</>}
        />
        <Route
          path="login"
          element={<>Login Page</>}
        />
      </Route>

      <Route
        path="/w"
        element={<>Workspace</>}
      >
        <Route
          index
          element={<>Hello There</>}
        />
        <Route
          path="chats"
          element={<>Hello Chat</>}
        >
          <Route
            index
            element={<>This is Chat</>}
          />
        </Route>
        <Route
          path="tasks"
          element={<>This is Tasks</>}
        />
      </Route>

      <Route
        path="*"
        element={<Not_Fount />}
      />
    </React.Fragment>
  )
);

const App = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;

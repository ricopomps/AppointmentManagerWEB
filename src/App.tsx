import { useEffect, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import { User } from "./models/user";
import * as UsersApi from "./network/usersApi";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import NotesPage from "./pages/NotesPages";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";
import HomePage from "./pages/HomePage";
import {
  SelectedDayProvider,
  initialState,
} from "./context/SelectedDayContext";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UsersApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {}
    }
    fetchLoggedInUser();
  }, []);
  return (
    <>
      <SelectedDayProvider selectedDay={initialState.selectedDay}>
        <BrowserRouter>
          <div>
            <NavBar
              loggedInUser={loggedInUser}
              onLoginClicked={() => setShowLoginModal(true)}
              onSignUpClicked={() => setShowSignUpModal(true)}
              onLogoutSuccessful={() => setLoggedInUser(null)}
            />
            <Container className={styles.pageContainer}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/notes"
                  element={<NotesPage loggedInUser={loggedInUser} />}
                />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/*" element={<NotFoundPage />} />
              </Routes>
            </Container>
            {showSignUpModal && (
              <SignUpModal
                onDismiss={() => setShowSignUpModal(false)}
                onSignUpSuccessful={(user) => {
                  setLoggedInUser(user);
                  setShowSignUpModal(false);
                }}
              />
            )}
            {showLoginModal && (
              <LoginModal
                onDismiss={() => setShowLoginModal(false)}
                onLoginSuccessful={(user) => {
                  setLoggedInUser(user);
                  setShowLoginModal(false);
                }}
              />
            )}
          </div>
        </BrowserRouter>
      </SelectedDayProvider>
    </>
  );
}

export default App;

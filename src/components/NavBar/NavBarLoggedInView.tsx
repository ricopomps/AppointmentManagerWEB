import { Button, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
import * as AuthApi from "../../network/authApi";

interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}
const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      await AuthApi.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <>
      <Navbar.Text>Logado como: {user.username}</Navbar.Text>
      <Button onClick={logout}>Sair</Button>
    </>
  );
};

export default NavBarLoggedInView;

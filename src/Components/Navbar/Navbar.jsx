import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  // Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from './../../Context/AuthContext';




export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {userLogin, setUserLogin} = useContext(AuthContext);
  const navigate =  useNavigate();

  
  const loggedMenuItems = ["home", "Log Out"];
  const unLoggedMenuItems = ["register", "login"];
  
  function logOut(){
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login")
    

  }

  return (
    <Navbar className="bg-blue-300">
      <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      <NavbarBrand>
        <p className="font-bold text-inherit">
          <Link to="/">Social-App</Link></p>
      </NavbarBrand>
      <NavbarContent as="div" justify="end">

        <NavbarContent className="hidden sm:flex gap-4" justify="center">

          {userLogin !==  null &&(<NavbarItem>
          <Link color="foreground"to="/">
            Home
          </Link>
        </NavbarItem>)}
        
        {userLogin === null &&  <>
        <NavbarItem>
          <Link color="foreground" to="/login">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" to="/register">
            Register
          </Link>
        </NavbarItem>
        </>}

        
      </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              //will change with login user logo
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            
            <DropdownItem key="settings"><Link className="w-full block" to="/profile">Profile</Link></DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => logOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {userLogin ? loggedMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
            onClick={item === "Log Out" && function (){logOut()}}  
              className="w-full block"
              color={
                index === 2 ? "primary" : index === loggedMenuItems.length - 1
                 ? "danger" : "foreground"
              }
              to={`/${item === "Log Out" ? "login" : item}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))  :unLoggedMenuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full block"
              color={
                index === 2 ? "primary" : index === unLoggedMenuItems.length - 1
                 ? "danger" : "foreground"
              }
              to={`${item}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))  }
      </NavbarMenu>
    </Navbar>
  );
}

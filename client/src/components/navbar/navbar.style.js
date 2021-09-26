import styled from "styled-components";

const NavBarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 5vh;

  align-items: center;
  min-width: 100vw;
  height: 10vh;

  background: rgba(46, 49, 49, 1);



  @media(max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: ${({ toggleNav }) => toggleNav ? '30vh' : '10vh'};

    // height: 40vh;
  }

  @media(max-width: 122px) {
    width: 100%;
  }
  

`


  

const Logo = styled.h1`
  
  a {
    color: #eee;
    text-decoration: none;
    margin-left: 50px;
    font-size: 30px;
  

  @media(max-width: 600px) {
    transition: .5s ease-in;
    width: 100%;
    margin-left: 0;
    padding-top: 150px;

  }

  @media(max-width: 500px) {
    font-size: 25px;
    margin-left: 0;
  }
`

const Hamburger = styled.a`
  position: absolute;
  top: 4vh;
  right: 5vh;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 21px;
  width: 30px;
  cursor: pointer;

  @media(max-width: 600px) {
    top: 3.5vh;
    right: 2vh;
    display: flex;
  }


  @media(max-width: 300px) {
    width: 20px;
    heigth: 8px;
  }

  span {
    height: 3px;
    width: 100%;
    background: #eee;
    border-radius: 10px;
  }

`


const NavBarItems = styled.div`
  ul{
    display: flex;
    align-items: center;

    @media(max-width: 600px) {
      flex-direction: column;
      display:  ${({ toggleNav }) => toggleNav ? 'flex' : 'none'};

      width: 100%;
      margin-bottom: 20px;

    }
      
    li {
      margin-right: 70px;
      list-style: none;
      font-size: 25px;
      font-weight: light;
      color: #eee;
      cursor: pointer;
      transition: 0.3s ease-in;
      
      @media (max-width: 600px) {
        transition: .3s ease-in;
        text-align: center;

        width: 100%;
      }

      @media(max-width: 500px) {
        text-align: center;
        font-size: 23px;
      }


      @media(max-width: 700px) {
        margin-right: 10px;
      
      }
      
      &:hover {
        border-bottom: 2px solid red;
      }

    }
  }

 

`


export { NavBarWrapper, Logo, NavBarItems, Hamburger }
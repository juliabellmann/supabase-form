// components/Layout.js
import styled from 'styled-components';
import Navi from './Navi';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Wrapper>
      <Navi />
      <Main>{children}</Main>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Main = styled.main`
  flex: 1;
  padding-bottom: 8rem;
`;

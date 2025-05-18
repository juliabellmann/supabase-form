import styled from 'styled-components';

export default function Footer() {
  return (
      <StyledFooter>
        <h5>Copyright BKI</h5>
      </StyledFooter>
  );
}

const StyledFooter = styled.div`
  background: var(--bg-color-highlight);
  margin-top: 4rem;
  padding: 1rem;
  color: var(--primary-color);

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed;

  bottom: 0;
  right: 0;
  left: 0;
  z-index: 10;

  height: 50px;
`;
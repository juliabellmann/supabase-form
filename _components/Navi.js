import Link from 'next/link';
import styled from 'styled-components';

export default function Navi() {
  return (
      <StyledNavigation>

          <h2>BKI Formular</h2>
          <Link href="https://www.bki.de">Homepage</Link>

      </StyledNavigation>
  );
}

const StyledNavigation = styled.div`
  width: 100%;
  background: var(--bg-color);
  padding: 1rem;
  color: var(--primary-color);
  font-weight: bold;
  border-bottom: 1px solid var(--secondary-color);
  padding: 0 5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

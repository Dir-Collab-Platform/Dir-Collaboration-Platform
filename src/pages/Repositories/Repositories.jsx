import { useContext } from 'react';
import RepositoryList from "./RepositoryList";
import { RepositoriesContext } from '../../context/RepositoriesContext/RepositoriesContext';
import RepositoriesProvider from '../../context/RepositoriesContext/RepositoriesProvider';
import Header from '../../common-components/Header/Header';
import Footer from '../../common-components/Footer/Footer';

function RepositoriesContent() {
  return (
    <>
      <Header />
      <RepositoryList />
      <Footer />
    </>
  );
}

export default function Repositories() {
  return (
    <RepositoriesProvider>
      <RepositoriesContent />
    </RepositoriesProvider>
  );
}

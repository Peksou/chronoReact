import Head from 'next/head';
import Chrono from '../components/Chrono';

function Index() {
  return (
    <div>
      <Head>
        <title>⏱️ Chronomètre Coding</title>
        <likn rel="icon" href="/favion.ico" />
      </Head>
      
      <Chrono />
    </div>
  )
}

export default Index;

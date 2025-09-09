import Head from 'next/head';
import Chrono from '../components/Chrono';

function Index() {
  return (
    <div>
      <Head>
        <title>⏱️ Motivation Chronos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Chrono />
    </div>
  )
}

export default Index;

import type {GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {sanityClient, urlFor} from '../sanity'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Andre's NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home


export const getServerSideProps: GetServerSideProps = async () =>{
  const query = `*[_type == "collection"]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator->{
    _id,
    name,
    address,
    slug {
    current
  },
  },
  }
  `

const collections = await sanityClient.fetch(query)
cl

}

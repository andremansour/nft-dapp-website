import React, { useEffect, useState } from "react";
import { useDisconnect, useAddress, useMetamask, useContract } from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";


interface Props{
	collection: Collection
}

function NftDropPage({collection}:Props) {

	const [claimedSupply, setClaimedSupply] = useState<number>(0);
	const [totalSupply, setTotalSupply] = useState<BigNumber>();

	const nftDrop = useContract(collection.address, "nft-drop").contract;

	//Auth

	const connectWithMetamask = useMetamask();
	const address = useAddress();
	const disconnect = useDisconnect();

	useEffect(() => {
		if(!nftDrop) return;

		const fetchNFTDropData = async () => {
			const claimedNFTs = await nftDrop.getAllClaimed();
			const total = await nftDrop.totalSupply();

			setClaimedSupply(claimedNFTs.length);
			console.log(setClaimedSupply(claimedNFTs.length))
			setTotalSupply(total); 
		}
		fetchNFTDropData()
	},[nftDrop])

	return (
		<div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
			{/* /{left side} */}
			<div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
				<div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
					<div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
						<img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" src={urlFor(collection.previewImage).url()} alt="" />
					</div>
					<div className="space-y-2 p-5 text-center ">
						<h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
						<h2 className="text-xl text-gray-300">{collection.description }</h2>
					</div>
				</div>
			</div>

			{/* {right side} */}
			<div className="flex flex-1 flex-col p-12 lg:col-span-6">
				{/* {Header} */}
			
				<header className="flex items-center justify-between">
					<Link href={'/'}>
					<h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
							Welcome to <span className="font-extrabold underline decoration-pink-600/50">ANDRE'S</span> NFT Marketplace
						</h1>
					</Link>
					<button onClick={() => (address ? disconnect() : connectWithMetamask())} className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base">
						{address? 'Sign out' : 'Sign in'}
					</button>
				</header>

				<hr className="my-2 border"/>

				{address && (
					<p className="text-center text-sm text-rose-400">You're logged in with your wallet {address.substring(0,5)}...{address.substring(address.length - 5)}</p>
				)}

				{/* {Content} */}
				<div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
					<img className="w-80 object-cover pb-10 lg:h-40" src={urlFor(collection.mainImage).url()} alt=""/>
					<h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>
					<p className="pt-2 text-xl text-green-500">{claimedSupply}Nfts claimed</p>
				</div>

				{/* {Mint Button} */}
				<button className="h-16 w-full rounded-full bg-red-600 text-white font-bold">
					Mint NFT (0.01 eth)
				</button>
			</div>
		</div>
	);
}

export default NftDropPage;

export const getServerSideProps: GetServerSideProps = async ({params}) => {

	const query = `*[_type == "collection" && slug.current == $id][0]{
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
	  `;

	const collection = await sanityClient.fetch(query, { 
		id: params?.id
	})

	if(!collection) {
		return{
			notFound:true
		}
	}
	return{
		props:{
			collection
		}
	}
}
